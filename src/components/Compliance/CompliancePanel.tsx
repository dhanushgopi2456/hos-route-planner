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
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-md p-6 ${className}`}>
      {/* Header with status badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            {compliant ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            )}
            <span>FMCSA HOS Compliance Verification Audit</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated verification against FMCSA CFR Part 395 regulations and assessment rules.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs ${
            compliant
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}
        >
          {compliant ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>HOS COMPLIANT</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>{violations.length} VIOLATION{violations.length > 1 ? 'S' : ''} DETECTED</span>
            </>
          )}
        </motion.div>
      </div>

      {/* Violations List (if any) */}
      {violations.length > 0 && (
        <div className="mb-6 space-y-2">
          <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Active HOS Violations ({violations.length})</span>
          </h4>
          <div className="space-y-2">
            {violations.map((violation, i) => (
              <div
                key={`violation-${i}`}
                className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900"
              >
                <div className="font-bold text-rose-950 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{violation.title || violation.rule_code}</span>
                </div>
                <p className="mt-1 text-rose-800">{violation.description}</p>
                {violation.remedy && (
                  <p className="mt-1 text-rose-700 font-medium text-[11px]">
                    Recommendation: {violation.remedy}
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
            className={`p-4 rounded-xl border transition-all ${
              check.passed
                ? 'bg-slate-50/80 border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20'
                : 'bg-rose-50/80 border-rose-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{check.title}</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  check.passed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {check.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>

            <p className="text-xs text-slate-600 ml-6 leading-relaxed">
              {check.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
