import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  fmcsaRef?: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'How does the 70-hour / 8-day rolling cycle limit work?',
      answer:
        'Under FMCSA 49 CFR § 395.3(b), a property-carrying driver cannot drive after accumulating 70 hours of on-duty time in any consecutive 8-day rolling window. When you input the driver’s Current Cycle Used Hours, the planner tracks remaining capacity and automatically verifies whether the requested trip can be completed legally or requires an off-duty 34-hour restart before dispatch.',
      fmcsaRef: '49 CFR § 395.3(b)(2)'
    },
    {
      question: 'How are the mandatory 30-minute break and 10-hour sleeper resets scheduled?',
      answer:
        'FMCSA rules mandate that drivers take an uninterrupted 30-minute off-duty or sleeper break after 8 cumulative hours of driving without at least a 30-minute interruption. Additionally, once a driver reaches 11 hours of driving or 14 hours of on-duty time, the planner automatically injects a mandatory 10 consecutive hour sleeper berth or off-duty rest period to reset the daily driving and duty clocks.',
      fmcsaRef: '49 CFR § 395.3(a)(1) & (a)(3)(ii)'
    },
    {
      question: 'How does the planner calculate commercial fuel stops?',
      answer:
        'Commercial diesel semi-trucks typically have a maximum range between 900 to 1,200 miles on dual 150-gallon tanks. The planner automatically identifies highway points before 1,000 cumulative miles of travel and injects a 30-minute fueling stop (categorized as Off-Duty or On-Duty based on carrier preference), ensuring the truck never runs empty.',
      fmcsaRef: 'Fleet Efficiency Standard'
    },
    {
      question: 'How are 24-hour daily ELD log sheets generated and split at midnight?',
      answer:
        'Each calendar day requires a standalone 24.00-hour Record of Duty Status (RODS) starting at 00:00:00 and ending at 23:59:59. When a driving leg or sleeper berth period crosses midnight, our normalization engine cleanly splits the event into two distinct records with identical duty states, ensuring that each daily log mathematically balances to exactly 24.00 hours.',
      fmcsaRef: '49 CFR § 395.8'
    },
    {
      question: 'Can I export and print certified FMCSA driver daily logs?',
      answer:
        'Yes. You can view each calendar day in the interactive 24-hour SVG graph grid, complete with all 4 duty lines, remarks, and driver signatures. You can print individual daily sheets or compile all days of a multi-day trip into a single high-resolution landscape PDF file formatted specifically for DOT roadside safety audits.',
      fmcsaRef: '49 CFR § 395.8(k)'
    }
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-24 bg-[#080C16] border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FMCSA Regulatory Questions &amp; Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight font-display">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base">
            Everything you need to know about our commercial HOS scheduling logic, automated stops, and ELD compliance.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md overflow-hidden transition-colors hover:border-slate-700/80"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-bold text-sm sm:text-base text-white font-display">
                    {faq.question}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {faq.fmcsaRef && (
                      <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {faq.fmcsaRef}
                      </span>
                    )}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700/80"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 font-sans">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
