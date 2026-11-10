import React from 'react';
import { ComplianceCheck, Violation } from '../../types/hos';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface CompliancePanelProps {
  complianceChecks: ComplianceCheck[];
  violations: Violation[];
  className?: string;
}

export const CompliancePanel: React.FC<CompliancePanelProps> = ({
  complianceChecks = [],
  violations = [],
  className = ''
}) => {
  const compliant = violations.length === 0;

  return (
    <div className={`rounded-xl bg-[#19191b] border border-[#232325] p-5 sm:p-6 text-[#ededed] ${className}`}>
      {/* Header with status badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#232325]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#141415] border border-[#232325] text-blue-400 text-xs font-mono mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FMCSA CFR Part 395 audit</span>
          </div>
          <h3 className="font-semibold text-base sm:text-lg text-white">
            FMCSA HOS compliance audit
          </h3>
          <p className="text-xs text-[#85858b] mt-0.5">
            Automated verification against FMCSA CFR Part 395 regulations, 11h/14h limits, and 24h RODS rules.
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono ${
            compliant
              ? 'bg-[#141415] text-emerald-400 border border-emerald-500/30'
              : 'bg-[#141415] text-rose-400 border border-rose-500/30'
          }`}
        >
          {compliant ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% HOS compliant</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>{violations.length} violation{violations.length > 1 ? 's' : ''} detected</span>
            </>
          )}
        </div>
      </div>

      {/* Violations List (if any) */}
      {violations.length > 0 && (
        <div className="mb-5 space-y-2">
          <h4 className="text-xs font-medium text-rose-400 flex items-center gap-1.5 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Active HOS violations ({violations.length})</span>
          </h4>
          <div className="space-y-2">
            {violations.map((violation, i) => (
              <div
                key={`violation-${i}`}
                className="p-3 bg-[#19191b] border border-rose-800/80 rounded-md text-xs text-rose-200"
              >
                <div className="font-medium text-white flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>{violation.title || violation.rule_code || violation.type}</span>
                </div>
                <p className="mt-1 text-rose-300 font-sans">{violation.description || violation.message}</p>
                {violation.remedy && (
                  <p className="mt-1 text-rose-400 text-[11px] font-mono">
                    Remedy: {violation.remedy}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8 Compliance Audit Checks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {complianceChecks.map((check, i) => (
          <div
            key={check.id || `check-${i}`}
            className={`p-3.5 rounded-lg border transition-colors ${
              check.passed
                ? 'bg-[#141415] border-[#232325] hover:border-[#2e2e32]'
                : 'bg-rose-950/30 border-rose-800/60'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="font-medium text-xs text-white flex items-center gap-2">
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{check.title}</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  check.passed
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {check.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>

            <p className="text-xs text-[#85858b] ml-6 leading-relaxed font-sans">
              {check.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
