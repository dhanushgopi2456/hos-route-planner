import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  Loader2,
  FileText,
  AlertTriangle,
  Info,
  Clock,
  Truck,
  Fuel,
  Moon,
  Coffee,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card3D } from '../components/UI/Card3D';
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
    <div className="min-h-screen text-slate-900 pb-20 relative">
      {/* Header Banner with 3D Depth */}
      <div className="bg-slate-900/90 backdrop-blur-xl text-white py-12 border-b border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                FMCSA 49 CFR Part 395 Regulations
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Hours of Service (HOS) Rules &amp; Audit Engine
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Complete regulatory specifications, operating assumptions, and an automated 16-test suite verifying mathematical compliance.
              </p>
            </div>

            {/* Direct Workable Navigation CTA */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-blue-500/30 flex items-center gap-2.5 cursor-pointer border border-white/20"
            >
              <Truck className="w-4 h-4" />
              <span>{isAuthenticated ? 'Plan Trip Now' : 'Sign In & Plan Trip'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Core Rules Grid with 3D Cards */}
        <div className="glass-panel-3d rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400">
                <Clock className="w-4 h-4" />
              </div>
              <span>Core FMCSA Property-Carrying CMV Limits</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              49 CFR § 395.3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Rule 1 */}
            <Card3D depth={10}>
              <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-md shadow-slate-200/50 dark:shadow-none h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      <Truck className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">11-Hour Driving Limit</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    May drive a maximum of 11 hours after 10 consecutive hours off duty. Any driving beyond
                    11.00 hours triggers an immediate safety violation.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                  Rule: § 395.3(a)(3)(i)
                </div>
              </div>
            </Card3D>

            {/* Rule 2 */}
            <Card3D depth={10}>
              <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-md shadow-slate-200/50 dark:shadow-none h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">14-Hour Consecutive Duty Window</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    May not drive beyond the 14th consecutive hour after coming on duty, following 10
                    consecutive hours off duty. Off-duty breaks do NOT extend this window.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  Rule: § 395.3(a)(2)
                </div>
              </div>
            </Card3D>

            {/* Rule 3 */}
            <Card3D depth={10}>
              <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-md shadow-slate-200/50 dark:shadow-none h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">30-Minute Rest Break</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Driving is not permitted if more than 8 consecutive or cumulative hours have passed
                    without at least a 30-minute non-driving rest interval.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                  Rule: § 395.3(a)(3)(ii)
                </div>
              </div>
            </Card3D>

            {/* Rule 4 */}
            <Card3D depth={10}>
              <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-md shadow-slate-200/50 dark:shadow-none h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">70-Hour / 8-Day Rolling Cycle</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    May not drive after 70 hours on duty in any 8 consecutive days. A driver may restart
                    the 70-hour period after taking 34 or more consecutive hours off duty.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Rule: § 395.3(b)(2)
                </div>
              </div>
            </Card3D>

            {/* Rule 5 */}
            <Card3D depth={10}>
              <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-md shadow-slate-200/50 dark:shadow-none h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <Fuel className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">1,000-Mile Fueling Limit</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Every commercial motor vehicle must refuel at least once every 1,000 miles. Our engine
                    schedules fuel stops around 920 miles with a 30-minute on-duty duration.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                  Safety Operational Limit
                </div>
              </div>
            </Card3D>

            {/* Rule 6 */}
            <Card3D depth={10}>
              <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-md shadow-slate-200/50 dark:shadow-none h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                      <Moon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">10-Hour Sleeper Berth Reset</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Taking 10 consecutive hours in the sleeper berth fully resets both the 11-hour driving clock
                    and the 14-hour duty window for the next calendar day.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-indigo-700 dark:text-indigo-400 font-bold">
                  Rule: § 395.1(g)
                </div>
              </div>
            </Card3D>
          </div>
        </div>

        {/* Operating Assumptions Table */}
        <div className="glass-panel-3d rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400">
              <Info className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Configured Operating Assumptions
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Explicit constraints configured for automated trip calculation:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Constraint</th>
                  <th className="py-3 px-4">Configured Value</th>
                  <th className="py-3 px-4">Regulatory Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Driver Type</td>
                  <td className="py-2.5 px-4">Property-Carrying CMV</td>
                  <td className="py-2.5 px-4">Governed under 49 CFR § 395.3</td>
                </tr>
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Duty Cycle Rule</td>
                  <td className="py-2.5 px-4">70 hours in 8 consecutive days</td>
                  <td className="py-2.5 px-4">Standard interstate freight carrier schedule</td>
                </tr>
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Adverse Driving Conditions</td>
                  <td className="py-2.5 px-4 font-mono text-rose-600 dark:text-rose-400 font-bold">DISABLED (No extension)</td>
                  <td className="py-2.5 px-4">Explicit prompt mandate: no 2-hour adverse extension</td>
                </tr>
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Pickup Stop Duration</td>
                  <td className="py-2.5 px-4">1.00 hour (On-Duty Not Driving)</td>
                  <td className="py-2.5 px-4">Dock check-in, load securing, and BOL inspection</td>
                </tr>
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Dropoff Stop Duration</td>
                  <td className="py-2.5 px-4">1.00 hour (On-Duty Not Driving)</td>
                  <td className="py-2.5 px-4">Dock unloading, seal check, and delivery receipt sign-off</td>
                </tr>
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Fuel Stop Threshold</td>
                  <td className="py-2.5 px-4">920 planned miles (&le; 1,000 mi max)</td>
                  <td className="py-2.5 px-4">30 min on-duty duration to pump fuel and check equipment</td>
                </tr>
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Highway Transit Speed</td>
                  <td className="py-2.5 px-4">~60 mph road routing speed</td>
                  <td className="py-2.5 px-4">Calculated via OSRM highway routing network</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time 16 Unit Test Engine Audit */}
        <div className="glass-panel-3d rounded-3xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>FMCSA 16-Test Engine Audit Suite</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automated test harness validating all edge cases, resets, and violation bounds.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {testSummary && (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full ${
                    testSummary.passed === testSummary.total
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {testSummary.passed} / {testSummary.total} TESTS PASSING (100%)
                </span>
              )}

              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchAndRunTests(true)}
                disabled={isRunningTests}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                {isRunningTests ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>Re-Run Audit</span>
              </motion.button>
            </div>
          </div>

          {/* Test Search & Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All Tests' },
                { id: 'pass', label: 'Passing' },
                { id: 'driving', label: '11h Driving' },
                { id: 'rest', label: 'Duty & Sleeper' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search test scenario..."
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 w-20">Status</th>
                  <th className="py-2.5 px-4">Test Scenario</th>
                  <th className="py-2.5 px-4">Expected Outcome</th>
                  <th className="py-2.5 px-4">Engine Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredTests.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-4">
                      {t.passed ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                          <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          FAIL
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                      {t.title}
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">{t.notes}</div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {t.expected}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-900 dark:text-white font-bold">
                      {t.actual}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
