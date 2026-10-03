// src/components/layout/AboutLayout/MilestoneSection.tsx
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MILESTONES } from "./constants";
import { fadeInUp, staggerContainer } from "./animations";

export default function MilestoneSection() {
  return (
    <section className="relative py-16 md:py-24 lg:py-28 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12 md:mb-16 space-y-3"
        >
          <motion.div variants={fadeInUp} custom={0}>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5">
              <Rocket className="size-3 mr-1.5" />
              Our Journey
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            custom={1}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight px-2"
          >
            Milestones That Define Us
          </motion.h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent md:-translate-x-1/2" />

          <div className="space-y-8 md:space-y-10">
            {MILESTONES.map((milestone, i) => {
              const Icon = milestone.icon;
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`relative flex items-center gap-6 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 pl-12 md:pl-0 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="inline-block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-5 md:p-6 shadow-sm hover:shadow-lg dark:shadow-none hover:border-primary/40 transition-all max-w-md w-full">
                      <span className="text-xs font-black text-[#FF5500] uppercase tracking-widest">
                        {milestone.year}
                      </span>
                      <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mt-1 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Icon Node */}
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 -translate-x-1/2">
                    <div className="h-9 md:h-10 w-9 md:w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-lg">
                      <Icon className="h-3.5 md:h-4 w-3.5 md:w-4 text-white" />
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}