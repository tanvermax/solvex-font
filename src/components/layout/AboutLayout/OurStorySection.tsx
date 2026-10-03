// src/components/layout/AboutLayout/OurStorySection.tsx
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, Check, X, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, staggerContainer } from "./animations";

const PROBLEMS = [
  "Chasing unresponsive vendors across email, phone, and WhatsApp",
  "Manually verifying supplier quality and compliance",
  "Negotiating pricing without market transparency",
  "Managing fragmented logistics across multiple carriers",
  "No accountability when deadlines slip",
];

const SOLUTIONS = [
  "Verified supplier network with quality guarantees",
  "Transparent factory-direct pricing, no middlemen",
  "Instant RFQ processing with 24-hour SLA",
  "Integrated logistics with real-time tracking",
  "Enterprise-grade compliance and legal protection",
];

export default function OurStorySection() {
  return (
    <section className="relative py-16 md:py-24 lg:py-28 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-12 md:space-y-16"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div variants={fadeInUp} custom={0}>
              <Badge
                variant="outline"
                className="text-[11px] font-bold uppercase tracking-widest border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300"
              >
                Why We Exist
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              custom={1}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight px-2"
            >
              A Broken System,
              <br />
              <span className="text-primary">Rebuilt from First Principles.</span>
            </motion.h2>
          </div>

          {/* Problem vs Solution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* PROBLEM */}
            <motion.div
              variants={fadeInUp}
              custom={2}
              className="relative rounded-3xl p-6 md:p-8 lg:p-10 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200/60 dark:border-red-900/40"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider mb-4 md:mb-6">
                <XCircle className="h-3 w-3" />
                The Industry Problem
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 leading-tight">
                40% of Procurement Time
                <br />
                is Wasted.
              </h3>

              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-slate-600 dark:text-slate-400">
                {PROBLEMS.map((item) => (
                  <li key={item} className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="h-3 w-3 text-red-500" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* SOLUTION */}
            <motion.div
              variants={fadeInUp}
              custom={3}
              className="relative rounded-3xl p-6 md:p-8 lg:p-10 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20 border border-blue-200/60 dark:border-blue-900/40"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-4 md:mb-6">
                <CheckCircle2 className="h-3 w-3" />
                The SolveX Solution
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 leading-tight">
                We Compressed
                <br />
                Weeks Into Hours.
              </h3>

              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-slate-600 dark:text-slate-400">
                {SOLUTIONS.map((item) => (
                  <li key={item} className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-emerald-500" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Closing Quote */}
          <motion.div
            variants={fadeInUp}
            custom={4}
            className="max-w-3xl mx-auto text-center p-6 md:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden"
          >
            <Quote className="absolute top-4 left-4 h-10 md:h-12 w-10 md:w-12 text-white/5" />
            <p className="text-base md:text-lg lg:text-xl font-bold text-white italic leading-relaxed relative z-10 px-2">
              "We're not building another marketplace. We're building the{" "}
              <span className="text-[#FF5500]">operating system</span> for
              enterprise procurement in South Asia."
            </p>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mt-4">
              — Sayem Kabir Saurav, Managing Director
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}