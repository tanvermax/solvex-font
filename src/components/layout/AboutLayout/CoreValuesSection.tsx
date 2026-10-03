// src/components/layout/AboutLayout/CoreValuesSection.tsx
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CORE_VALUES } from "./constants";
import { fadeInUp, staggerContainer } from "./animations";

export default function CoreValuesSection() {
  return (
    <section className="relative py-16 md:py-24 lg:py-28 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12 md:mb-14 space-y-3"
        >
          <motion.div variants={fadeInUp} custom={0}>
            <Badge className="bg-[#FF5500]/10 text-[#FF5500] border-[#FF5500]/20 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5">
              <Sparkles className="size-3 mr-1.5" />
              Our Core Values
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            custom={1}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight px-2"
          >
            Principles That Drive Every Decision
          </motion.h2>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {CORE_VALUES.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all p-6 md:p-8 shadow-sm hover:shadow-xl dark:shadow-none overflow-hidden"
              >
                {/* Gradient Accent */}
                <div
                  className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                />

                <div
                  className={`h-12 md:h-14 w-12 md:w-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 md:mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-6 md:h-7 w-6 md:w-7 text-white" />
                </div>

                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2 md:mb-3">
                  {value.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}