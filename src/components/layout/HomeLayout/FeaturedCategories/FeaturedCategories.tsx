"use client";

import { Link } from "react-router";
import { motion } from "framer-motion";
import { 
  Factory, 
  ShieldCheck, 
  Package, 
  Wrench, 
  Zap, 

  Sparkles,
  ArrowUpRight 
} from "lucide-react";

const B2B_CATEGORIES = [
  {
    id: "industrial-supplies",
    name: "Industrial & Factory Supplies",
    description: "Machinery parts, lubricants & industrial consumables.",
    icon: Factory,
    href: "/products?category=industrial-supplies",
    // Unsplash High-Quality Industrial Image
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "safety-ppe",
    name: "Safety Equipment & PPE",
    description: "Certified helmets, gloves, high-vis gear & safety shoes.",
    icon: ShieldCheck,
    href: "/products?category=safety-ppe",
    image: "https://images.unsplash.com/photo-1618090584126-129cd1f3fbae?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "packaging-materials",
    name: "Packaging & Logistics",
    description: "Corrugated cartons, stretch films, strapping & tapes.",
    icon: Package,
    href: "/products?category=packaging-materials",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "tools-equipment",
    name: "Tools & Machinery",
    description: "Power tools, pneumatic systems & precision instruments.",
    icon: Wrench,
    href: "/products?category=tools-equipment",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "electrical-supplies",
    name: "Electrical & Automation",
    description: "Switches, breakers, industrial wiring & sensors.",
    icon: Zap,
    href: "/products?category=electrical-supplies",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
  },
  // {
  //   id: "warehouse-supplies",
  //   name: "Warehouse & Material Handling",
  //   description: "Pallet jacks, storage racks & inventory gear.",
  //   icon: Boxes,
  //   href: "/products?category=warehouse-supplies",
  //   image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=600",
  // },
  // {
  //   id: "corporate-office",
  //   name: "Corporate & Office Supplies",
  //   description: "Bulk stationery, IT consumables & office essentials.",
  //   icon: Briefcase,
  //   href: "/products?category=corporate-office",
  //   image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
  // },
  {
    id: "custom-sourcing",
    name: "Custom Sourcing & RFQ",
    description: "Specialized bulk procurement & factory direct sourcing.",
    icon: Sparkles,
    href: "/sourcing",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&q=80&w=600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 260, damping: 20 } 
  },
} as any;

export default function CategorySection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden border-b border-border/40">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#FF5500]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-14 gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-[11px] font-extrabold uppercase tracking-widest shadow-inner">
              <Sparkles className="size-3 fill-current" />
              <span>Supply Solutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Explore Product <span className="text-[#0F52BA] dark:text-blue-400">Categories</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
              Direct procurement catalog tailored for industrial enterprises and verified corporate buyers.
            </p>
          </div>

          <div className="sm:hidden self-end">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted/80 px-3 py-1.5 rounded-full border border-border/60 flex items-center gap-1.5 shadow-sm">
              <span>Swipe</span>
              <span className="animate-pulse text-[#FF5500]">➔</span>
            </span>
          </div>
        </div>

        {/* Categories Grid */}
        <motion.div 
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-6 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none touch-pan-x"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {B2B_CATEGORIES.map((category) => {
            const Icon = category.icon;
            
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.96 }}
                className="snap-start shrink-0 w-[82vw] sm:w-auto"
              >
                <Link to={category.href} className="group block h-full">
                  <div 
                    className={`relative h-64 sm:h-72 rounded-2xl p-6 transition-all duration-500 overflow-hidden border shadow-md group-hover:shadow-2xl ${
                      category.isFeatured 
                        ? "border-[#FF5500]/60 shadow-[#FF5500]/10" 
                        : "border-slate-200/80 dark:border-slate-800 hover:border-primary/50"
                    }`}
                  >
                    {/* Background Image with Zoom & Dark Overlay */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      {/* Dark Overlay for Ultra Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60 dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950/70 group-hover:via-slate-950/70 transition-colors duration-300" />
                    </div>

                    {/* Content Layer */}
                    <div className="flex flex-col justify-between h-full relative z-10 text-white">
                      
                      {/* Top Row: Glass Icon & Arrow */}
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 shadow-lg ${
                          category.isFeatured
                            ? "bg-[#FF5500] text-white shadow-[#FF5500]/40"
                            : "bg-white/10 dark:bg-slate-900/40 text-white border border-white/20"
                        }`}>
                          <Icon className="size-5" />
                        </div>

                        <div className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white/80 group-hover:text-white group-hover:bg-[#FF5500] transition-all border border-white/10">
                          <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>

                      {/* Bottom Title & Description */}
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-base md:text-lg text-white group-hover:text-[#FF5500] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed font-normal">
                          {category.description}
                        </p>
                      </div>

                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}