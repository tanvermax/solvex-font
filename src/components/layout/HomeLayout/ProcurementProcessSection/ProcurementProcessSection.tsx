"use client";

import { motion } from "framer-motion";
import { Link } from "react-router";
import { 
  FileSpreadsheet, 
  Cpu, 
  Truck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Submit Custom RFQ",
    description: "Specify your industrial requirements, target quantities, and delivery timelines through our smart quotation portal.",
    icon: FileSpreadsheet,
    badge: "Instant Request",
  },
  {
    step: "02",
    title: "Review & Fast Quotation",
    description: "Our procurement specialists and verified OEM partners analyze specs and return competitive tier pricing within 24 hours.",
    icon: Cpu,
    badge: "24h Turnaround",
  },
  {
    step: "03",
    title: "Secure Bulk Fulfillment",
    description: "Approve the quote, utilize flexible corporate credit terms, and receive palletized delivery right to your facility.",
    icon: Truck,
    badge: "Nationwide Freight",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProcurementProcessSection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden border-b border-border/40">
      
      {/* Immersive Glassmorphism Background Glows */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FF5500]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[#FF5500] text-xs font-bold uppercase tracking-widest shadow-inner">
            <Sparkles className="size-3.5" />
            Seamless Enterprise Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            How Procurement Works at SolveX
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Designed for corporate buyers and industrial managers to streamline complex supply chains effortlessly.
          </p>
        </div>

        {/* Workflow Steps Grid with Glassmorphism */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        >
          {WORKFLOW_STEPS.map((item) => {
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.step}
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                className="group relative"
              >
                {/* Glassmorphism Card */}
                <div className="relative h-full rounded-2xl p-6 sm:p-8 bg-card/40 dark:bg-slate-900/40 backdrop-blur-xl border border-border/70 hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  
                  {/* Background Step Watermark */}
                  <span className="absolute -top-4 -right-2 text-7xl sm:text-8xl font-black text-muted/10 dark:text-muted/5 pointer-events-none select-none group-hover:text-primary/10 transition-colors">
                    {item.step}
                  </span>

                  <div className="space-y-5 relative z-10">
                    {/* Top Icon & Badge Row */}
                    <div className="flex items-center justify-between">
                      <div className="p-3.5 rounded-xl bg-background/80 dark:bg-slate-800/80 border border-border/80 text-foreground group-hover:text-[#FF5500] group-hover:scale-110 transition-all shadow-md">
                        <Icon className="size-6 text-primary group-hover:text-[#FF5500] transition-colors" />
                      </div>
                      
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/70 px-3 py-1 rounded-full border border-border/40">
                        {item.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#FF5500]">Step {item.step}</span>
                        <div className="h-px bg-border/60 flex-1" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Check Indicator */}
                  <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground relative z-10">
                    <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                      <CheckCircle className="size-3.5" /> Verified Stage
                    </span>
                    <span className="font-mono text-muted-foreground/60 group-hover:text-foreground transition-colors">
                      SolveX B2B
                    </span>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Call to Action Banner inside Glass Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-blue-900/10 via-primary/10 to-[#FF5500]/10 backdrop-blur-2xl border border-primary/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Ready to streamline your industrial procurement?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Submit your Bill of Quantities (BOQ) or RFQ list now and get dedicated pricing within hours.
            </p>
          </div>

          <Button 
            asChild 
            size="lg" 
            className="bg-[#FF5500] hover:bg-[#e04b00] active:scale-95 transition-transform text-white font-semibold text-sm sm:text-base px-8 h-12 shadow-md shadow-[#FF5500]/20 rounded-xl group shrink-0"
          >
            <Link to="/rfq" className="flex items-center gap-2">
              <span>Submit Custom RFQ</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}