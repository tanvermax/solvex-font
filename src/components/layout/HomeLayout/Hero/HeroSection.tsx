"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, Building, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative min-h-[90vh] pt-32 pb-16 flex items-center justify-center  to-background dark:from-slate-950 dark:via-slate-900 dark:to-background overflow-hidden">
      
      {/* 3D Modern Background Illustration Placeholder Grid */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(#0F52BA_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" /> */}

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content & Input (Image Style) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <ShieldCheck className="size-4 text-[#FF5500]" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Verified B2B Supply Chain
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.1]">
              Procure your <br />
              <span className="text-[#0F52BA] dark:text-blue-400">industrial supplies</span> <br />
              seamlessly now!
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              With SolveX, enterprise procurement officers can easily source bulk materials, manage BOQs, and get factory-direct quotations in minutes.
            </p>

            {/* Pill Search / Sourcing Input Bar (Exact Image Style) */}
            <form onSubmit={handleSearchSubmit} className="pt-2">
              <div className="flex items-center max-w-md p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none focus-within:border-[#0F52BA] transition-all">
                <div className="flex items-center gap-2 px-3 text-slate-400">
                  <Building className="size-4 text-[#FF5500]" />
                  <span className="text-xs font-semibold border-r pr-2.5 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    Sourcing
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Enter product name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none px-2"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="rounded-full bg-[#FF5500] hover:bg-[#e04b00] text-white shrink-0 size-9 shadow-md"
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Right Image Container (Image Style 3D Look) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative flex justify-end items-center"
          >
            <div className="relative w-full max-w-lg aspect-square rounded-3xl bg-gradient-to-tr from-[#0F52BA]/10 via-slate-200/40 to-[#FF5500]/10 dark:from-slate-900 dark:to-slate-800 p-6 border border-white/60 dark:border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="absolute top-10 right-10 size-40 bg-[#0F52BA]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 left-10 size-40 bg-[#FF5500]/20 rounded-full blur-3xl pointer-events-none" />
              
              {/* Floating Badge Example */}
              <div className="self-end bg-white dark:bg-slate-900 border border-border p-3 rounded-2xl shadow-lg flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0F52BA]">
                  <Search className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">Fast Factory Quotations</p>
                  <p className="text-[10px] text-muted-foreground">Within 24 Hours Guaranteed</p>
                </div>
              </div>

              {/* Central Mock 3D Card Visual */}
              <div className="my-auto text-center p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 dark:border-slate-700 shadow-xl space-y-2">
                <div className="inline-block p-4 rounded-2xl bg-[#0F52BA] text-white mb-2 shadow-lg shadow-[#0F52BA]/30">
                  <Building className="size-10" />
                </div>
                <h3 className="text-lg font-black text-foreground">SolveX B2B Hub</h3>
                <p className="text-xs text-muted-foreground">Industrial Sourcing & Procurement Platform</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}