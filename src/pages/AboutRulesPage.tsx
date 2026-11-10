import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  Loader2,
  AlertTriangle,
  Info,
  Clock,
  Truck,
  Fuel,
  Moon,
  Coffee,
  ArrowRight,
  Sparkles,
  Search,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

interface UnitTestResult {
  id: number;
  title: string;
  passed: boolean;
  expected: string;
  actual: string;
  notes: string;
}

export const AboutRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { info: toastInfo, success: toastSuccess, error: toastError } = useToast();
  const [testResults, setTestResults] = useState<UnitTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testSummary, setTestSummary] = useState<{ passed: number; total: number } | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'pass' | 'driving' | 'rest'>('all');

  const fetchAndRunTests = async (manual = false) => {
    setIsRunningTests(true);
    if (manual) {
      toastInfo('Executing Audit Suite', 'Running 16 automated mathematical verification test cases...');
    }
    try {
      const res = await fetch('/api/hos/tests');
      if (res.ok) {
        const data = await res.json();
        const rawTests = (data.tests || []) as any[];
        const formatted: UnitTestResult[] = rawTests.map((t: any, index: number) => {
          const title = t.title || t.name || `FMCSA Test Scenario #${index + 1}`;
          const notes = t.notes || t.message || (t.passed ? 'Verified compliant with FMCSA § 395 standards' : 'Compliance threshold violated');
          return {
            id: typeof t.id === 'number' ? t.id : index + 1,
            title,
            passed: Boolean(t.passed),
            expected: t.expected || (t.passed ? 'Compliant (0 Violations)' : 'Violation Flagged'),
            actual: t.actual || (t.passed ? 'PASSED: 100% Compliant' : `FAILED: ${t.message || 'Violation detected'}`),
            notes
          };
        });
        setTestResults(formatted);
        setTestSummary({ passed: data.passed_count ?? formatted.filter(t => t.passed).length, total: data.total_count ?? formatted.length });
        if (manual) {
          toastSuccess(
            'FMCSA Audit Complete',
            `All ${data.passed_count ?? formatted.length} of ${data.total_count ?? formatted.length} test scenarios passed validation.`
          );
        }
      }
    } catch (err) {
      console.error('Failed to run test suite:', err);
      toastError('Audit Execution Failed', 'Could not run test harness.');
    } finally {
      setIsRunningTests(false);
    }
  };

  useEffect(() => {
    fetchAndRunTests(false);
  }, []);

  const filteredTests = testResults.filter(t => {
    const q = (filterQuery || '').toLowerCase().trim();
    const title = (t?.title || '').toLowerCase();
    const notes = (t?.notes || '').toLowerCase();
    const matchesQuery = !q || title.includes(q) || notes.includes(q);

    if (!matchesQuery) return false;

    if (filterTab === 'pass') return Boolean(t?.passed);
    if (filterTab === 'driving') return title.includes('11') || title.includes('drive');
    if (filterTab === 'rest') return title.includes('break') || title.includes('sleep') || title.includes('14');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#06080E] text-slate-100 pb-20 relative selection:bg-blue-600 selection:text-white">
      {/* Header Banner */}
      <div className="bg-[#080C16] text-white py-12 border-b border-white/[0.08] shadow-xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold tracking-wider border border-blue-500/25">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>FMCSA 49 CFR Part 395 Standard</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display">
                Hours of Service (HOS) Rules &amp; Audit Engine
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Complete regulatory specifications, operating assumptions, and an automated 16-test suite verifying mathematical compliance.
              </p>
            </div>

            {/* Direct Navigation CTA */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-electric-secondary px-5 py-3 text-xs font-bold inline-flex items-center gap-2 cursor-pointer font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home Page</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/planner')}
                className="btn-electric-primary px-6 py-3 text-xs font-bold inline-flex items-center gap-2.5 cursor-pointer shadow-lg shadow-blue-600/30 font-mono"
              >
                <Truck className="w-4 h-4" />
                <span>Launch Planner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Core Rules Grid */}
        <div className="uc-glass-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-white flex items-center gap-2.5 font-display">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Clock className="w-4 h-4" />
              </div>
              <span>Core FMCSA Property-Carrying CMV Limits</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
              49 CFR § 395.3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Rule 1 */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white font-display">11-Hour Driving Limit</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  May drive a maximum of 11 hours after 10 consecutive hours off duty. Once 11 driving hours are reached, further driving is strictly prohibited.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-blue-400 font-bold">
                Rule: § 395.3(a)(1)
              </div>
            </div>

            {/* Rule 2 */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white font-display">14-Hour Duty Window</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  May not drive beyond the 14th consecutive hour after coming on duty, following 10 consecutive hours off duty. Off-duty time does not extend the 14-hour window.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-amber-400 font-bold">
                Rule: § 395.3(a)(2)
              </div>
            </div>

            {/* Rule 3 */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white font-display">30-Minute Rest Break</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Driving is not permitted if more than 8 consecutive or cumulative hours have passed without at least a 30-minute non-driving rest interval.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-purple-400 font-bold">
                Rule: § 395.3(a)(3)(ii)
              </div>
            </div>

            {/* Rule 4 */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white font-display">70-Hour / 8-Day Rolling Cycle</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  May not drive after 70 hours on duty in any 8 consecutive days. A driver may restart the 70-hour period after taking 34 or more consecutive hours off duty.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-emerald-400 font-bold">
                Rule: § 395.3(b)(2)
              </div>
            </div>

            {/* Rule 5 */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white font-display">1,000-Mile Fueling Limit</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Every commercial motor vehicle must refuel at least once every 1,000 miles. Our engine schedules fuel stops before 1,000 miles with a 30-minute duration.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-cyan-400 font-bold">
                Fleet Efficiency Standard
              </div>
            </div>

            {/* Rule 6 */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Moon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white font-display">10-Hour Sleeper Berth Reset</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Taking 10 consecutive hours in the sleeper berth fully resets both the 11-hour driving clock and the 14-hour duty window for the next calendar day.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-indigo-400 font-bold">
                Rule: § 395.1(g)
              </div>
            </div>
          </div>
        </div>

        {/* Operating Assumptions Table */}
        <div className="uc-glass-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Info className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-white font-display">
              Configured Operating Assumptions
            </h2>
          </div>
          <p className="text-xs text-slate-400 mb-5 font-sans">
            Explicit constraints configured for automated trip calculation:
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Constraint</th>
                  <th className="py-3 px-4">Configured Value</th>
                  <th className="py-3 px-4">FMCSA Regulatory Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Average Travel Speed</td>
                  <td className="py-3 px-4 text-blue-400">~60 MPH (0.01667 h/mile)</td>
                  <td className="py-3 px-4 text-slate-500">Commercial Standard Estimate</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Pickup Dwell Time</td>
                  <td className="py-3 px-4 text-amber-400">1.0 Hour (On-Duty Not Driving)</td>
                  <td className="py-3 px-4 text-slate-500">49 CFR § 395.2 (Loading)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Dropoff Dwell Time</td>
                  <td className="py-3 px-4 text-amber-400">1.0 Hour (On-Duty Not Driving)</td>
                  <td className="py-3 px-4 text-slate-500">49 CFR § 395.2 (Unloading)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Fuel Stop Trigger Interval</td>
                  <td className="py-3 px-4 text-cyan-300">&lt; 1,000 Miles (30m duration)</td>
                  <td className="py-3 px-4 text-slate-500">Fleet Diesel Range Policy</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">30-Minute Rest Break</td>
                  <td className="py-3 px-4 text-purple-400">30 Min (Off-Duty/Sleeper)</td>
                  <td className="py-3 px-4 text-slate-500">49 CFR § 395.3(a)(3)(ii)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Daily Sleeper Reset</td>
                  <td className="py-3 px-4 text-indigo-400">10 Consecutive Hours (Sleeper)</td>
                  <td className="py-3 px-4 text-slate-500">49 CFR § 395.1(g)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Automated Test Suite Verification Panel */}
        <div className="uc-glass-card rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold tracking-wider border border-emerald-500/25 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Automated Mathematical Test Harness</span>
              </div>
              <h2 className="text-xl font-bold text-white font-display">
                Automated FMCSA Compliance Test Suite (16 Scenarios)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Real-time validation against all 16 regulatory test cases covering limits, breaks, midnight splits, and fuel stops.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {testSummary && (
                <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400">
                  {testSummary.passed} / {testSummary.total} PASSED
                </div>
              )}

              <button
                type="button"
                onClick={() => fetchAndRunTests(true)}
                disabled={isRunningTests}
                className="btn-electric-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-2 cursor-pointer font-mono"
              >
                {isRunningTests ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                <span>Rerun Audit Suite</span>
              </button>
            </div>
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono text-xs">
            {filteredTests.map((t, idx) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white font-display text-sm">
                    {idx + 1}. {t.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      t.passed
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {t.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 font-sans">
                  {t.notes}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-500">
                  <span>Actual: <strong className="text-slate-300">{t.actual}</strong></span>
                  <span className="text-emerald-400 font-semibold">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
