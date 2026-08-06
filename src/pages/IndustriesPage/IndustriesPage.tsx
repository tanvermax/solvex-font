"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { 
  Building2, 
  Shirt, 
  Zap, 
  Pill, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  ShieldCheck,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";

const INDUSTRIES = [
  {
    id: "textiles",
    name: "Ready-Made Garments & Textiles",
    icon: Shirt,
    tagline: "OEKO-TEX Certified Raw Materials & Packaging Supplies",
    description: "Bulk supply chain fulfillment for RMG factories. From industrial packaging, high-tension sewing threads, to safety gear compliant with Accord/Alliance standards.",
    compliance: ["OEKO-TEX Standard 100", "Accord Safety Approved", "ISO 9001:2015"],
    popularProducts: [
      "Corrugated Carton Boxes (5-Ply & 7-Ply)",
      "High-Speed Poly Bag Sealing Machines",
      "Anti-Static PPE Coveralls & Gloves",
      "Industrial Sewing Machine Parts"
    ],
    stats: "Over 120+ Garment Factories Supplied",
    accent: "from-blue-600/10 to-transparent",
  },
  {
    id: "construction",
    name: "Construction & Infrastructure",
    icon: Building2,
    tagline: "Heavy Equipment, Structural Steel & Site Safety Gear",
    description: "Direct-from-mill procurement for megaprojects and commercial contractors. Wholesale supply of ANSI-rated safety equipment, fasteners, and heavy power tools.",
    compliance: ["ANSI Z89.1 Approved", "ASTM A36 Steel Standards", "CE Certified"],
    popularProducts: [
      "Heavy Duty Safety Helmets & Harnesses",
      "High-Tension Anchor Bolts & Fasteners",
      "Digital Laser Distance Meters",
      "Industrial Power Cables & Generators"
    ],
    stats: "Trusted on 45+ Commercial Sites",
    accent: "from-[#FF5500]/10 to-transparent",
  },
  {
    id: "power",
    name: "Power, Energy & Electrical",
    icon: Zap,
    tagline: "High-Voltage Cables, Substation Parts & Testing Gear",
    description: "Certified electrical supply solutions for power plants, factories, and commercial installations with full OEM test certifications.",
    compliance: ["IEC Electrical Standards", "ISO 14001 Compliant", "Flame Retardant Grade"],
    popularProducts: [
      "High-Voltage Copper Armored Cables",
      "Digital Insulation Resistance Testers",
      "Industrial Circuit Breakers & Relays",
      "Power Factor Correction Capacitors"
    ],
    stats: "Zero-Defect Quality Guarantee",
    accent: "from-amber-500/10 to-transparent",
  },
  {
    id: "pharma",
    name: "Pharmaceuticals & Chemicals",
    icon: Pill,
    tagline: "Cleanroom Supplies, Stainless Steel Fittings & PPE",
    description: "Strict cGMP-compliant procurement for pharmaceutical labs and chemical processing facilities. Sterility and precision guaranteed.",
    compliance: ["cGMP Grade Materials", "FDA Approved Polymers", "Cleanroom Class 100"],
    popularProducts: [
      "SS 316L Sanitary Valves & Pipes",
      "Cleanroom Anti-Static Garments",
      "Precision Digital Analytical Balances",
      "Chemical Resistant Nitrile Gloves"
    ],
    stats: "Supplying Top 15 Pharma Labs",
    accent: "from-emerald-500/10 to-transparent",
  },
];

export default function IndustriesPage() {
  const [activeTab, setActiveTab] = useState(INDUSTRIES[0].id);
  const activeIndustry = INDUSTRIES.find((i) => i.id === activeTab) || INDUSTRIES[0];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
      
      {/* Background Soft Glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#FF5500]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* ================= 1. HERO HEADER ================= */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-[11px] font-extrabold uppercase tracking-widest"
          >
            <Sparkles className="size-3.5 fill-current animate-pulse" />
            <span>Tailored B2B Solutions</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]"
          >
            Industry-Specific <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-[#FF5500]">Procurement Systems</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto"
          >
            We align with your industry's exact compliance, safety, and operational standards. Streamlining supply chains for Bangladesh’s leading industrial sectors.
          </motion.p>
        </div>

        {/* ================= 2. INDUSTRY SELECTOR TABS ================= */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
          {INDUSTRIES.map((ind) => {
            const Icon = ind.icon;
            const isActive = activeTab === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveTab(ind.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
                  isActive
                    ? "bg-[#FF5500] text-white border-[#FF5500] shadow-md shadow-[#FF5500]/20 scale-105"
                    : "bg-card text-muted-foreground border-border/70 hover:border-border hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                <span>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* ================= 3. ACTIVE INDUSTRY DETAIL DISPLAY ================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndustry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-card border border-border/70 p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden mb-16"
          >
            {/* Ambient Background Accent */}
            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${activeIndustry.accent} pointer-events-none`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Column: Info & Description */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF5500] uppercase tracking-wider bg-[#FF5500]/10 px-3 py-1 rounded-md">
                    <ShieldCheck className="size-3.5" />
                    <span>{activeIndustry.stats}</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {activeIndustry.name}
                  </h2>
                  
                  <p className="text-sm font-semibold text-primary">
                    {activeIndustry.tagline}
                  </p>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                    {activeIndustry.description}
                  </p>
                </div>

                {/* Compliance Badges */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground block uppercase tracking-wide">
                    Industry Compliance Standards:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeIndustry.compliance.map((item) => (
                      <span key={item} className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs sm:text-sm h-11 px-6 rounded-xl shadow-md shadow-[#FF5500]/20"
                  >
                    <Link to={`/rfq?industry=${activeIndustry.id}`} className="flex items-center gap-2">
                      <FileText className="size-4" />
                      <span>Request {activeIndustry.name.split(" ")[0]} RFQ</span>
                    </Link>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-xs sm:text-sm font-bold h-11 px-6 rounded-xl border-border/80 gap-2 hover:bg-muted"
                  >
                    <Download className="size-4 text-muted-foreground" />
                    <span>Download Spec Sheet</span>
                  </Button>
                </div>

              </div>

              {/* Right Column: High-Demand Supplies List */}
              <div className="lg:col-span-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/60 p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider border-b border-border/40 pb-3 flex items-center justify-between">
                  <span>High-Demand Supplies</span>
                  <Wrench className="size-4 text-[#FF5500]" />
                </h3>

                <ul className="space-y-3">
                  {activeIndustry.popularProducts.map((prod, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-foreground font-semibold">
                      <span className="size-5 rounded-full bg-[#FF5500]/10 text-[#FF5500] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{prod}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <Button asChild variant="ghost" className="w-full text-xs font-bold text-[#FF5500] hover:text-[#FF5500] hover:bg-[#FF5500]/10 justify-between rounded-xl">
                    <Link to="/products">
                      <span>Explore Full {activeIndustry.name.split(" ")[0]} Inventory</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>

              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* ================= 4. BOTTOM ENTERPRISE CALLOUT ================= */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-950/20 via-background to-[#FF5500]/10 backdrop-blur-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Require multi-factory corporate credit billing?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal">
              Get 30 to 90-day credit terms, automated VAT/TAX compliant invoices, and dedicated key account management for large enterprises.
            </p>
          </div>

          <Button 
            asChild 
            size="lg" 
            className="bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs sm:text-sm px-6 h-11 rounded-xl shadow-md shrink-0"
          >
            <Link to="/contact">
              Apply for Corporate Account
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}