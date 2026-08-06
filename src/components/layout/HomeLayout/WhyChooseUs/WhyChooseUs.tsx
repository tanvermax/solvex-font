"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Layers, 
  BadgeCheck,
  Sparkles
} from "lucide-react";

const ADVANTAGES = [
  {
    id: "quality",
    title: "100% Certified Direct Sourcing",
    description: "Every item is sourced directly from verified OEM manufacturers with strict ISO quality standards.",
    icon: ShieldCheck,
    tag: "Verified OEM",
    accentColor: "from-blue-500/20 via-blue-500/5 to-transparent",
  },
  {
    id: "logistics",
    title: "Streamlined Enterprise Logistics",
    description: "Priority freight, palletized delivery, and real-time shipment tracking for smooth factory replenishment.",
    icon: Truck,
    tag: "Nationwide",
    accentColor: "from-[#FF5500]/20 via-[#FF5500]/5 to-transparent",
  },
  {
    id: "support",
    title: "Dedicated Procurement Account Managers",
    description: "One-on-one technical consultation and instant RFQ pricing turnarounds from industry specialists.",
    icon: Headphones,
    tag: "24/7 Priority",
    accentColor: "from-emerald-500/20 via-emerald-500/5 to-transparent",
  },
];

// Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 20 },
  },
} as any;

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden border-b border-border/40">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Minimalist Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-xs font-extrabold uppercase tracking-widest"
          >
            <BadgeCheck className="size-3.5 fill-current" />
            <span>The SolveX Standard</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground"
          >
            Built for Modern B2B Procurement
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal"
          >
            Eliminate supply chain bottlenecks with enterprise-grade reliability and seamless fulfillment.
          </motion.p>
        </div>

        {/* Advantage Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-6 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none touch-pan-x"
        >
          {ADVANTAGES.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="snap-start shrink-0 w-[82vw] sm:w-auto h-full"
              >
                <div className="group relative flex flex-col justify-between h-full rounded-2xl bg-card border border-border/60 hover:border-[#FF5500]/40 transition-all duration-300 p-6 md:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_16px_35px_rgba(0,0,0,0.4)] overflow-hidden">
                  
                  {/* Hover Accent Glow Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  <div className="space-y-5 relative z-10">
                    {/* Top Row: Icon Box & Tag */}
                    <div className="flex items-center justify-between">
                      <div className="p-3.5 rounded-xl bg-background border border-border/80 text-foreground group-hover:text-[#FF5500] group-hover:border-[#FF5500]/30 group-hover:scale-110 transition-all duration-300 shadow-sm">
                        <Icon className="size-6 text-[#FF5500]" />
                      </div>
                      
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted/80 px-3 py-1 rounded-md border border-border/40 font-mono">
                        {item.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 pt-1">
                      <h3 className="font-extrabold text-lg md:text-xl text-foreground group-hover:text-[#FF5500] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Indicator */}
                  <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground/60 relative z-10">
                    <span className="font-bold text-[11px] group-hover:text-[#FF5500] transition-colors">
                      0{index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <Sparkles className="size-3.5 opacity-0 group-hover:opacity-100 text-[#FF5500] transition-opacity duration-300" />
                      <Layers className="size-3.5 opacity-40 group-hover:opacity-0 transition-opacity duration-300" />
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}