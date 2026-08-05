"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Truck, 

  Headphones, 
  Layers, 
  BadgeCheck 
} from "lucide-react";

// Minimal B2B Value Propositions
const ADVANTAGES = [
  {
    id: "quality",
    title: "100% Certified Direct Sourcing",
    description: "Every item is sourced directly from verified OEM manufacturers with strict ISO quality standards.",
    icon: ShieldCheck,
    tag: "Verified OEM",
  },
  {
    id: "logistics",
    title: "Streamlined Enterprise Logistics",
    description: "Priority freight, palletized delivery, and real-time shipment tracking for smooth factory replenishment.",
    icon: Truck,
    tag: "Nationwide",
  },
  // {
  //   id: "finance",
  //   title: "Flexible Corporate Credit & Tax Invoicing",
  //   description: "Transparent VAT/TAX compliant billing with tailored 30 to 90-day credit terms for qualified buyers.",
  //   icon: Receipt,
  //   tag: "B2B Billing",
  // },
  {
    id: "support",
    title: "Dedicated Procurement Account Managers",
    description: "One-on-one technical consultation and instant RFQ pricing turnarounds from industry specialists.",
    icon: Headphones,
    tag: "24/7 Priority",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-14 md:py-24 bg-background relative overflow-hidden border-b border-border/40">
      
      {/* Soft Minimal Background Glass Reflection */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Minimalist Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[#FF5500] text-xs font-bold uppercase tracking-widest">
            <BadgeCheck className="size-3.5" />
            The SolveX Standard
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Built for Modern B2B Procurement
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Eliminate supply chain bottlenecks with enterprise-grade reliability and seamless fulfillment.
          </p>
        </div>

        {/* 
          Mobile: Horizontal Swipe Carousel (snap-x)
          Desktop: 4-Column Clean Grid Layout
        */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {ADVANTAGES.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.98 }}
                className="snap-start shrink-0 w-[80vw] xs:w-[280px] sm:w-auto"
              >
                <div className="group relative flex flex-col justify-between h-full rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-900/5 dark:bg-slate-100/5 hover:bg-slate-900/10 dark:hover:bg-slate-100/10 backdrop-blur-md p-6 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
                  
                  <div className="space-y-4">
                    {/* Top Row: Stylish Glass Icon Box & Tag */}
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-background/80 dark:bg-slate-900/80 border border-border/60 text-foreground group-hover:text-primary group-hover:scale-105 transition-all shadow-sm">
                        <Icon className="size-6 text-primary group-hover:text-[#FF5500] transition-colors" />
                      </div>
                      
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 bg-muted/60 px-2.5 py-1 rounded-md border border-border/30">
                        {item.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 pt-2">
                      <h3 className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground/80 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Subtle Card Accent Indicator */}
                  <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between text-[11px] font-mono text-muted-foreground/60">
                    <span>0{index + 1}</span>
                    <Layers className="size-3.5 opacity-40 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}