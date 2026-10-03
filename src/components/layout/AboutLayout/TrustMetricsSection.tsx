// src/components/layout/AboutLayout/TrustMetricsSection.tsx
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { METRICS, COMPLIANCE } from "./constants";
import { fadeInUp, staggerContainer } from "./animations";

export default function TrustMetricsSection() {
  return (
    <section className="relative py-16 md:py-24 lg:py-28 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-white/10">
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
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5">
              <Activity className="size-3 mr-1.5" />
              By the Numbers
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            custom={1}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Proven at Enterprise Scale
          </motion.h2>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto mb-12 md:mb-16">
          {METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative rounded-2xl bg-white dark:bg-gradient-to-b dark:from-white/5 dark:to-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-primary/40 p-4 md:p-6 text-center group transition-all shadow-sm hover:shadow-lg dark:shadow-none"
              >
                <div className="h-10 md:h-12 w-10 md:w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 md:h-6 w-5 md:w-6 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-slate-400 tracking-tight">
                  {metric.value}
                </p>
                <p className="text-[11px] md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 md:mt-2">
                  {metric.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-slate-300 dark:to-white/20" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500">
              Trusted • Certified • Compliant
            </span>
            <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-slate-300 dark:to-white/20" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {COMPLIANCE.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all shadow-sm"
              >
                <item.icon className="h-3.5 md:h-4 w-3.5 md:w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-[11px] md:text-xs font-bold text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}