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
      fmcsaRef: 'Fleet efficiency standard'
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
    <section id="faq" className="relative py-20 bg-[#0f0f10] border-t border-[#232325] text-[#ededed]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#141415] border border-[#232325] text-blue-400 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FMCSA regulatory questions &amp; answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
            Frequently asked questions.
          </h2>

          <p className="text-[#a1a1a6] text-xs sm:text-sm leading-relaxed font-normal">
            Everything you need to know about commercial HOS scheduling logic, automated stops, and ELD compliance.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-lg border border-[#232325] bg-[#19191b] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none group"
                >
                  <span className="font-medium text-xs sm:text-sm text-[#ededed] group-hover:text-white transition-colors">
                    {faq.question}
                  </span>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {faq.fmcsaRef && (
                      <span className="hidden sm:inline-block text-[10px] font-mono text-[#85858b] px-2 py-0.5 rounded bg-[#141415] border border-[#232325]">
                        {faq.fmcsaRef}
                      </span>
                    )}
                    <div className="w-6 h-6 rounded-md bg-[#232325] text-[#a1a1a6] flex items-center justify-center">
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-400' : ''
                        }`}
                      />
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-[#a1a1a6] text-xs sm:text-sm leading-relaxed border-t border-[#232325] font-sans">
                        {faq.answer}
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
