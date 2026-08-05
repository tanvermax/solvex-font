"use client";

import { motion } from "framer-motion";
import { Link } from "react-router";
import { 
  Building2, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  FileCheck2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "500+", label: "Verified Factory Partners", icon: Building2 },
  { value: "৳25M+", label: "Monthly B2B Procurement", icon: TrendingUp },
  { value: "99.4%", label: "On-Time Bulk Delivery", icon: CheckCircle2 },
  { value: "1,200+", label: "Corporate Clients", icon: Users },
];

export default function EnterpriseSourcingSection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden border-b border-border/40">
      
      {/* Dynamic Animated Ambient Light Balls for Mobile & Desktop */}
      {/* <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-80 h-80 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" /> */}
      {/* <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#FF5500]/15 rounded-full blur-[160px] pointer-events-none" /> */}

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Main Glassmorphism Hero Card */}
        <div className="relative rounded-3xl border border-white/20 dark:border-slate-800/80 bg-slate-900/10 dark:bg-slate-100/5 backdrop-blur-2xl p-6 sm:p-10 md:p-14 shadow-2xl overflow-hidden">
          
          {/* Subtle Glass Reflection Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-slate-700 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center sm:text-left">
              
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[#FF5500] md:text-xs text-[8px] font-bold uppercase tracking-widest"
              >
                <Sparkles className="size-3.5 fill-[#FF5500]" />
                <span>Custom Sourcing Engine</span>
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
                Can’t Find What You Need?{" "}
                <span className="bg-gradient-to-r from-blue-600 via-primary to-[#FF5500] bg-clip-text text-transparent block sm:inline">
                  We Source It Direct.
                </span>
              </h2>

              {/* Description */}
              <p className="text-[8px] sm:text-base text-muted-foreground leading-relaxed font-normal max-w-xl">
                Have specific industrial requirements, machinery specifications, or custom factory imports? Submit your BOM (Bill of Materials) or technical sheets—our international sourcing network handles the rest.
              </p>

              {/* Key Highlights List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[10px] sm:text-sm font-semibold text-foreground/90">
                <div className=" flex items-center gap-2 justify-center sm:justify-start">
                  <FileCheck2 className="size-4 text-emerald-500 shrink-0" />
                  <span>Custom OEM & ODM Manufacturing</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <ShieldAlert className="size-4 text-blue-500 shrink-0" />
                  <span>Quality Duty Inspection Included</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full sm:w-auto bg-[#FF5500] hover:bg-[#e04b00] active:scale-95 transition-all text-white font-bold text-sm sm:text-base px-8 h-12 shadow-lg shadow-[#FF5500]/25 rounded-xl group"
                >
                  <Link to="/sourcing" className="flex items-center justify-center gap-2">
                    <span>Submit Sourcing Request</span>
                    <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </Button>

                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto active:scale-95 transition-all font-semibold text-sm sm:text-base px-7 h-12 rounded-xl border-border/80 backdrop-blur-md hover:bg-muted/80"
                >
                  <Link to="/rfq">Upload BOQ File</Link>
                </Button>
              </div>

            </div>

            {/* Right Column: Animated Stats Cards (Mobile Interactive Grid) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4">
              {STATS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative p-4 sm:p-5 rounded-2xl bg-background/60 dark:bg-slate-900/60 backdrop-blur-md border border-border/60 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary group-hover:bg-[#FF5500] group-hover:text-white transition-colors">
                      <Icon className="size-4 sm:size-5" />
                    </div>

                    <div className="mt-4 space-y-1">
                      <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {stat.value}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground font-medium leading-snug">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}