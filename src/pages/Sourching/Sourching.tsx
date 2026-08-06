"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe2, 
  ShieldCheck, 
  FileUp, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Factory, 
  Truck, 
  BadgeCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SOURCING_CAPABILITIES = [
  {
    step: "01",
    title: "Global OEM Factory Matching",
    description: "We bypass trading intermediaries and negotiate directly with verified tier-1 manufacturers across Asia and Europe.",
    icon: Factory,
  },
  {
    step: "02",
    title: "Rigorous ISO Quality Inspection",
    description: "On-site quality audits and material compliance tests are conducted prior to factory dispatch.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    title: "Customs & Duty Clearance",
    description: "Full handling of import documentation, port clearances, VAT/TAX invoices, and freight logistics.",
    icon: Globe2,
  },
  {
    step: "04",
    title: "Doorstep Industrial Freight",
    description: "Palletized logistics with flexible credit terms delivered straight to your warehouse or project site.",
    icon: Truck,
  },
];

export default function SourcingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    productName: "",
    quantity: "",
    specifications: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
      
      {/* Background Soft Glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#FF5500]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* ================= 1. HERO SECTION ================= */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-[11px] font-extrabold uppercase tracking-widest"
          >
            <Sparkles className="size-3.5 fill-current animate-pulse" />
            <span>Factory Direct Procurement</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]"
          >
            Custom Sourcing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-[#FF5500]">Hard-to-Find Industrial Supplies</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Can't find your specific machinery part, raw material, or OEM equipment in local stock? Submit your Bill of Quantities (BOQ) and let our global sourcing team handle the rest.
          </motion.p>
        </div>

        {/* ================= 2. TWO-COLUMN LAYOUT: SOURCING FORM + TRUST & WORKFLOW ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20">
          
          {/* Left Column: Interactive Custom RFQ Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7 rounded-3xl bg-card border border-border/70 p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 size-36 bg-[#FF5500]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-black text-foreground tracking-tight">
                Submit Custom Sourcing Request
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                Receive competitive factory-direct pricing within 24 hours.
              </p>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4 bg-muted/30 rounded-2xl border border-emerald-500/30 p-6"
              >
                <div className="size-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Sourcing Request Received!</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  Our industrial procurement specialists have received your specifications. A dedicated account manager will contact you within 24 hours with factory quote options.
                </p>
                <Button 
                  onClick={() => setSubmitted(false)} 
                  variant="outline" 
                  className="rounded-xl text-xs font-bold mt-2"
                >
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Company Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Apex Engineering Ltd."
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Work Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="buyer@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Product Name / Equipment *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Hydraulic Valve 250 Bar"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Required Quantity / MOQ *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 500 Units / 20 Rolls"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Detailed Specifications & Requirements</label>
                  <textarea
                    rows={4}
                    placeholder="Provide technical specs, grade, dimensions, target delivery date, or OEM part numbers..."
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl p-3.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* File Upload Box */}
                <div className="border-2 border-dashed border-border/80 hover:border-[#FF5500]/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-muted/20">
                  <FileUp className="size-6 text-[#FF5500] mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-foreground">Upload BOQ or Technical Datasheet (PDF/XLS)</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Maximum file size: 25MB</p>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs sm:text-sm h-12 rounded-xl shadow-md shadow-[#FF5500]/20 transition-all gap-2"
                >
                  <Send className="size-4" />
                  <span>Request Factory Quote</span>
                </Button>
              </form>
            )}
          </motion.div>

          {/* Right Column: Sourcing Process & Guarantees */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Quick Trust Highlights */}
            <div className="rounded-2xl bg-card border border-border/60 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <BadgeCheck className="size-5 text-[#FF5500]" />
                <span>The SolveX Sourcing Promise</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>100% Factory Direct:</strong> No middleman markups. Direct pricing from certified manufacturers.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Duty & Logistics Included:</strong> Complete clearance and door-to-door freight management.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Pre-Shipment Inspection:</strong> Rigorous lab and quality checks before departure.</span>
                </div>
              </div>
            </div>

            {/* Sourcing Process Steps */}
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-foreground tracking-tight">
                How Our Sourcing Works
              </h3>

              <div className="space-y-3">
                {SOURCING_CAPABILITIES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="rounded-2xl bg-card/60 border border-border/50 p-4 flex items-start gap-3.5 hover:border-[#FF5500]/40 transition-colors">
                      <div className="p-2.5 rounded-xl bg-background border border-border/60 text-[#FF5500] shrink-0">
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#FF5500]">STEP {item.step}</span>
                          <h4 className="font-bold text-xs sm:text-sm text-foreground">{item.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground font-normal leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>

        </div>

        {/* ================= 3. BOTTOM CTA & Direct Line ================= */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-950/20 via-background to-[#FF5500]/10 backdrop-blur-2xl border border-primary/20 text-center space-y-3">
          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Need Urgent Sourcing Consultation?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto font-normal">
            Speak directly with an enterprise procurement account specialist for bulk order planning.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs sm:text-sm px-6 h-11 rounded-xl shadow-md">
              <a href="tel:+8801700000000">Call Sourcing Desk (+880) 1700-000000</a>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}