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
    <div className={`uc-card-stark p-6 sm:p-8 ${className}`}>
      {/* Header with status badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#242424]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#242424] text-[#99A9EE] text-xs font-mono uppercase font-bold tracking-widest mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6677E3]" />
            <span>FMCSA CFR Part 395 Standard Audit</span>
          </div>
          <h3 className="font-bold text-xl text-white font-display flex items-center gap-2 uppercase tracking-tight">
            <span>FMCSA HOS Compliance Verification Audit</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Automated verification against FMCSA CFR Part 395 regulations, 11h/14h limits, and 24h RODS rules.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
            compliant
              ? 'bg-[#161616] text-emerald-400 border border-emerald-500/40'
              : 'bg-[#161616] text-rose-400 border border-rose-500/40'
          }`}
        >
          {compliant ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% HOS COMPLIANT</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>{violations.length} VIOLATION{violations.length > 1 ? 'S' : ''} DETECTED</span>
            </>
          )}
        </motion.div>
      </div>

      {/* Violations List (if any) */}
      {violations.length > 0 && (
        <div className="mb-6 space-y-2">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wide flex items-center gap-1.5 font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Active HOS Violations ({violations.length})</span>
          </h4>
          <div className="space-y-2">
            {violations.map((violation, i) => (
              <div
                key={`violation-${i}`}
                className="p-3.5 bg-rose-950/40 border border-rose-800/80 rounded-sm text-xs text-rose-200"
              >
                <div className="font-bold text-white flex items-center gap-1.5 font-display">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>{violation.title || violation.rule_code || violation.type}</span>
                </div>
                <p className="mt-1 text-rose-300 font-sans">{violation.description || violation.message}</p>
                {violation.remedy && (
                  <p className="mt-1 text-rose-400 font-medium text-[11px] font-mono">
                    Remedy: {violation.remedy}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8 Compliance Audit Checks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {complianceChecks.map((check, i) => (
          <motion.div
            key={check.id || `check-${i}`}
            whileHover={{ y: -2, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`p-4 rounded-sm border transition-all ${
              check.passed
                ? 'bg-[#161616] border-[#242424] hover:border-[#374151]'
                : 'bg-rose-950/40 border-rose-800/80'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="font-bold text-xs text-white flex items-center gap-2 font-display">
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{check.title}</span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  check.passed
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {check.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>

            <p className="text-xs text-slate-400 ml-6 leading-relaxed font-sans">
              {check.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
