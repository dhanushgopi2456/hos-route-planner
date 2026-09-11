import React from 'react';
import { DailyLog, DutyStatus, TimelineEvent } from '../../types/hos';

interface EldLogGraphProps {
  log: DailyLog;
  className?: string;
  showRemarksPointers?: boolean;
}

export const EldLogGraph: React.FC<EldLogGraphProps> = ({
  log,
  className = 'w-full overflow-x-auto',
  showRemarksPointers = true
}) => {
  // SVG Dimensions & Layout Constants
  const svgWidth = 1000;
  const svgHeight = 220;

  const labelColWidth = 120;
  const totalColWidth = 80;
  const gridStartX = labelColWidth;
  const gridWidth = svgWidth - labelColWidth - totalColWidth; // 800px for 24h => 33.33px per hour
  const hourWidth = gridWidth / 24;

  const gridStartY = 35;
  const rowHeight = 28;
  const numRows = 4;
  const gridEndY = gridStartY + numRows * rowHeight; // 35 + 112 = 147

  // Row Y positions (center of each row for duty line)
  const getRowCenterY = (status: DutyStatus): number => {
    switch (status) {
      case 'OFF_DUTY':
        return gridStartY + 0.5 * rowHeight; // row 1
      case 'SLEEPER_BERTH':
        return gridStartY + 1.5 * rowHeight; // row 2
      case 'DRIVING':
        return gridStartY + 2.5 * rowHeight; // row 3
      case 'ON_DUTY_NOT_DRIVING':
        return gridStartY + 3.5 * rowHeight; // row 4
    }
  };

  // Convert time ISO to x coordinate (minutes / 1440)
  const getXForTime = (isoString: string): number => {
    const d = new Date(isoString);
    // Use UTC hours and minutes for clean home terminal time standard
    const minutes = d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60;
    const fraction = Math.max(0, Math.min(1.0, minutes / 1440));
    return gridStartX + fraction * gridWidth;
  };

  // Build the continuous path points for the duty status line
  const buildDutyPath = (): { pathData: string; transitions: { x: number; y: number; label: string; location: string }[] } => {
    const events = log.events || [];
    if (events.length === 0) return { pathData: '', transitions: [] };

    let d = '';
    const transitions: { x: number; y: number; label: string; location: string }[] = [];
    let lastX = gridStartX;
    let lastY = getRowCenterY(events[0].status);

    events.forEach((ev, idx) => {
      const startX = getXForTime(ev.start_time);
      const endX = getXForTime(ev.end_time);
      const currentY = getRowCenterY(ev.status);

      if (idx === 0) {
        // Start path
        d += `M ${startX.toFixed(2)} ${currentY.toFixed(2)}`;
        lastX = startX;
        lastY = currentY;
      } else if (Math.abs(currentY - lastY) > 0.1) {
        // Vertical transition line
        d += ` L ${startX.toFixed(2)} ${lastY.toFixed(2)}`;
        d += ` L ${startX.toFixed(2)} ${currentY.toFixed(2)}`;

        transitions.push({
          x: startX,
          y: currentY,
          label: ev.reason || ev.status,
          location: ev.location_name
        });
      }

      // Horizontal line along current duty row
      d += ` L ${endX.toFixed(2)} ${currentY.toFixed(2)}`;
      lastX = endX;
      lastY = currentY;
    });

    return { pathData: d, transitions };
  };

  const { pathData, transitions } = buildDutyPath();

  const hourLabels = [
    'Mid-night', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
    'Noon', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'Mid-night'
  ];

  return (
    <div className={`bg-white p-3 rounded-lg border border-slate-300 shadow-xs font-sans ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto select-none"
        style={{ minWidth: '850px' }}
      >
        {/* Top Header Background */}
        <rect x="0" y="0" width={svgWidth} height="28" fill="#0f172a" rx="3" />
        <text x="12" y="18" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
          RECORD OF DUTY STATUS (24 HOURS)
        </text>

        {/* Top Hour Labels */}
        {hourLabels.map((label, i) => {
          const x = gridStartX + i * hourWidth;
          const isMidOrNoon = i === 0 || i === 12 || i === 24;
          return (
            <text
              key={`hr-${i}`}
              x={x}
              y="20"
              textAnchor="middle"
              fill="#ffffff"
              fontSize={isMidOrNoon ? '8.5' : '9'}
              fontWeight={isMidOrNoon ? 'bold' : 'normal'}
            >
              {label}
            </text>
          );
        })}
        <text
          x={gridStartX + gridWidth + totalColWidth / 2}
          y="18"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9.5"
          fontWeight="bold"
        >
          TOTAL
        </text>

        {/* 4 Duty Status Row Labels on Left */}
        {[
          { text: '1. OFF DUTY', y: gridStartY + 0.5 * rowHeight },
          { text: '2. SLEEPER BERTH', y: gridStartY + 1.5 * rowHeight },
          { text: '3. DRIVING', y: gridStartY + 2.5 * rowHeight },
          { text: '4. ON DUTY (NOT DRIVING)', y: gridStartY + 3.5 * rowHeight }
        ].map((row, i) => (
          <g key={`row-label-${i}`}>
            <rect
              x="0"
              y={gridStartY + i * rowHeight}
              width={labelColWidth}
              height={rowHeight}
              fill={i % 2 === 0 ? '#f8fafc' : '#ffffff'}
              stroke="#cbd5e1"
              strokeWidth="0.75"
            />
            <text
              x="8"
              y={row.y + 4}
              fontSize="9"
              fontWeight="bold"
              fill="#1e293b"
            >
              {row.text}
            </text>
          </g>
        ))}

        {/* Main Grid Background */}
        <rect
          x={gridStartX}
          y={gridStartY}
          width={gridWidth}
          height={numRows * rowHeight}
          fill="#ffffff"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Horizontal Row Divider Lines */}
        {[1, 2, 3].map(i => (
          <line
            key={`h-line-${i}`}
            x1={gridStartX}
            y1={gridStartY + i * rowHeight}
            x2={gridStartX + gridWidth}
            y2={gridStartY + i * rowHeight}
            stroke="#94a3b8"
            strokeWidth="0.75"
          />
        ))}

        {/* Vertical Hour & Quarter-Hour Tick Lines */}
        {Array.from({ length: 24 }).map((_, hourIndex) => {
          const hourX = gridStartX + hourIndex * hourWidth;
          return (
            <g key={`hour-grid-${hourIndex}`}>
              {/* Full height hour divider line */}
              <line
                x1={hourX}
                y1={gridStartY}
                x2={hourX}
                y2={gridEndY}
                stroke={hourIndex === 12 ? '#475569' : '#cbd5e1'}
                strokeWidth={hourIndex === 12 ? '1.5' : '1'}
              />

              {/* Sub-ticks inside each row for 15, 30, 45 minutes */}
              {[0, 1, 2, 3].map(rowIdx => {
                const rowTop = gridStartY + rowIdx * rowHeight;
                const rowBot = rowTop + rowHeight;
                return (
                  <g key={`subticks-${hourIndex}-${rowIdx}`}>
                    {/* 15m */}
                    <line
                      x1={hourX + hourWidth * 0.25}
                      y1={rowTop}
                      x2={hourX + hourWidth * 0.25}
                      y2={rowTop + 5}
                      stroke="#94a3b8"
                      strokeWidth="0.6"
                    />
                    {/* 30m (taller) */}
                    <line
                      x1={hourX + hourWidth * 0.5}
                      y1={rowTop}
                      x2={hourX + hourWidth * 0.5}
                      y2={rowTop + 9}
                      stroke="#64748b"
                      strokeWidth="0.8"
                    />
                    {/* 45m */}
                    <line
                      x1={hourX + hourWidth * 0.75}
                      y1={rowTop}
                      x2={hourX + hourWidth * 0.75}
                      y2={rowTop + 5}
                      stroke="#94a3b8"
                      strokeWidth="0.6"
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Final 24th hour right border */}
        <line
          x1={gridStartX + gridWidth}
          y1={gridStartY}
          x2={gridStartX + gridWidth}
          y2={gridEndY}
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Right Totals Column Boxes & Numbers */}
        {[
          { val: log.off_duty_hours, y: gridStartY },
          { val: log.sleeper_berth_hours, y: gridStartY + rowHeight },
          { val: log.driving_hours, y: gridStartY + 2 * rowHeight },
          { val: log.on_duty_not_driving_hours, y: gridStartY + 3 * rowHeight }
        ].map((t, idx) => (
          <g key={`total-box-${idx}`}>
            <rect
              x={gridStartX + gridWidth}
              y={t.y}
              width={totalColWidth}
              height={rowHeight}
              fill="#f8fafc"
              stroke="#94a3b8"
              strokeWidth="0.75"
            />
            <text
              x={gridStartX + gridWidth + totalColWidth / 2}
              y={t.y + rowHeight / 2 + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#0f172a"
              fontFamily="monospace"
            >
              {(t.val ?? 0).toFixed(2)}
            </text>
          </g>
        ))}

        {/* Grand Total Box (Must be 24.00) */}
        <rect
          x={gridStartX + gridWidth}
          y={gridEndY}
          width={totalColWidth}
          height="24"
          fill="#f1f5f9"
          stroke="#0f172a"
          strokeWidth="1.2"
        />
        <text
          x={gridStartX + gridWidth + totalColWidth / 2}
          y={gridEndY + 16}
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill={log.validation_status === 'VALID' ? '#15803d' : '#b91c1c'}
          fontFamily="monospace"
        >
          = {(log.total_hours ?? 24).toFixed(2)}
        </text>

        {/* Remarks Guideline Line */}
        <rect
          x="0"
          y={gridEndY + 2}
          width={gridStartX + gridWidth}
          height="20"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        <text x="10" y={gridEndY + 15} fontSize="9" fontWeight="bold" fill="#475569">
          REMARKS REFERENCE LINE
        </text>

        {/* ------------------------------------------------------------- */}
        {/* THE FMCSA ACTIVE DUTY STATUS LINE (CRISP BLUE OVERLAY) */}
        {/* ------------------------------------------------------------- */}
        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="miter"
            style={{ filter: 'drop-shadow(0px 1px 2px rgba(37,99,235,0.3))' }}
          />
        )}

        {/* Vertical Transition Indicators & Remarks Connectors */}
        {showRemarksPointers &&
          transitions.map((t, i) => (
            <g key={`transition-${i}`}>
              {/* Dot at change of status */}
              <circle cx={t.x} cy={t.y} r="3" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1" />
              {/* Projection dashed line down to remarks line */}
              <line
                x1={t.x}
                y1={t.y}
                x2={t.x}
                y2={gridEndY + 20}
                stroke="#2563eb"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.75"
              />
              {/* Location Tag */}
              <text
                x={t.x}
                y={gridEndY + 32}
                fontSize="7.5"
                fill="#1e293b"
                textAnchor="start"
                transform={`rotate(45, ${t.x}, ${gridEndY + 32})`}
                fontWeight="500"
              >
                {t.location.split(',')[0]}
              </text>
            </g>
          ))}
      </svg>
    </div>
  );
};
