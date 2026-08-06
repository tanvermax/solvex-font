"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {  useSearchParams } from "react-router";
import { 
  FileText, 
  Upload, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Building2,
  PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RFQPage() {
  const [searchParams] = useSearchParams();
  const prefilledProduct = searchParams.get("product") || "";
  const prefilledIndustry = searchParams.get("industry") || "";

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    workEmail: "",
    phone: "",
    industry: prefilledIndustry || "rmg",
    productDetails: prefilledProduct ? `RFQ for Product ID: ${prefilledProduct}` : "",
    quantity: "",
    targetPrice: "",
    paymentTerms: "cash",
    deliveryTimeline: "urgent",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
      
      {/* Background Soft Glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#FF5500]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* ================= 1. HERO HEADER ================= */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10 md:mb-14">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-[11px] font-extrabold uppercase tracking-widest"
          >
            <Sparkles className="size-3.5 fill-current animate-pulse" />
            <span>Fast-Track Corporate Bidding</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]"
          >
            Request a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-[#FF5500]">Formal RFQ / Price Quote</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Submit your material requirements or BOQ. Our industrial procurement team will review your specifications and issue a verified factory quote within 24 hours.
          </motion.p>
        </div>

        {/* ================= 2. RFQ FORM & SIDEBAR ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          
          {/* Main Form Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8 rounded-3xl bg-card border border-border/70 p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden"
          >
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4 bg-muted/20 rounded-2xl border border-emerald-500/30 p-6"
              >
                <div className="size-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-10" />
                </div>
                <h2 className="text-2xl font-black text-foreground">RFQ Submitted Successfully!</h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  Your reference ID is <strong className="text-foreground">#RFQ-{Math.floor(100000 + Math.random() * 900000)}</strong>. An official quotation will be emailed to <span className="text-primary font-bold">{formData.workEmail || "your email"}</span> shortly.
                </p>
                <Button 
                  onClick={() => setSubmitted(false)} 
                  variant="outline" 
                  className="rounded-xl text-xs font-bold mt-2"
                >
                  Submit Another Quote
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section 1: Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase text-foreground tracking-wider border-b border-border/40 pb-2 flex items-center gap-2">
                    <Building2 className="size-4 text-[#FF5500]" />
                    <span>1. Company & Contact Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Your Full Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Tanveer Hossain"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Company / Organization *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. SolveX Textiles Ltd."
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Work Email *</label>
                      <input
                        required
                        type="email"
                        placeholder="procurement@company.com"
                        value={formData.workEmail}
                        onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                        className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Phone / WhatsApp Number *</label>
                      <input
                        required
                        type="tel"
                        placeholder="+880 1700-000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Procurement Details */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black uppercase text-foreground tracking-wider border-b border-border/40 pb-2 flex items-center gap-2">
                    <FileText className="size-4 text-[#FF5500]" />
                    <span>2. Order Specifications</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Target Industry</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                      >
                        <option value="rmg">Ready-Made Garments & Textiles</option>
                        <option value="construction">Construction & Infrastructure</option>
                        <option value="power">Power, Energy & Electrical</option>
                        <option value="pharma">Pharmaceuticals & Healthcare</option>
                        <option value="other">Other Industrial Sector</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Required Quantity & Unit *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. 2,000 Pcs or 50 Rolls"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Detailed Product Requirements / Part Numbers *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Specify material grade, exact measurements, color, target delivery date, or OEM references..."
                      value={formData.productDetails}
                      onChange={(e) => setFormData({ ...formData, productDetails: e.target.value })}
                      className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl p-3.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* BOQ Drag and Drop Upload */}
                  <div className="border-2 border-dashed border-border/80 hover:border-[#FF5500]/50 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-muted/20">
                    <Upload className="size-7 text-[#FF5500] mx-auto mb-2" />
                    <p className="text-xs font-bold text-foreground">Drag & Drop BOQ / Technical Datasheet</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Supports PDF, XLSX, DOCX, PNG (Max 25MB)</p>
                  </div>
                </div>

                {/* Section 3: Commercial Preferences */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black uppercase text-foreground tracking-wider border-b border-border/40 pb-2 flex items-center gap-2">
                    <Clock className="size-4 text-[#FF5500]" />
                    <span>3. Delivery & Payment Terms</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Required Delivery Timeline</label>
                      <select
                        value={formData.deliveryTimeline}
                        onChange={(e) => setFormData({ ...formData, deliveryTimeline: e.target.value })}
                        className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                      >
                        <option value="urgent">Urgent (Within 3–5 Days)</option>
                        <option value="standard">Standard (7–14 Days)</option>
                        <option value="scheduled">Scheduled Monthly Delivery</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Preferred Payment Method</label>
                      <select
                        value={formData.paymentTerms}
                        onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                        className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                      >
                        <option value="cash">Advance / Bank Transfer</option>
                        <option value="lc">Letter of Credit (L/C)</option>
                        <option value="credit">30-Day Corporate Credit (Verified Accounts)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs sm:text-sm h-12 rounded-xl shadow-md shadow-[#FF5500]/20 transition-all gap-2"
                >
                  <Send className="size-4" />
                  <span>Submit RFQ for Official Quote</span>
                </Button>

              </form>
            )}
          </motion.div>

          {/* Right Sidebar: Trust Metrics & Fast Hotline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Guarantee Box */}
            <div className="rounded-2xl bg-card border border-border/70 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-5 text-[#FF5500]" />
                <span>SolveX RFQ Guarantees</span>
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>24-Hour Quotation Turnaround:</strong> Guaranteed official PDF quote in your inbox.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Transparent Price Breakdown:</strong> Clear unit pricing, VAT/TAX, and logistics costs.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>NDA & IP Protection:</strong> Your technical drawings and specs are kept strictly confidential.</span>
                </div>
              </div>
            </div>

            {/* Direct Assistance Callout */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-950/30 to-background border border-primary/20 p-6 space-y-3 text-center">
              <div className="size-10 rounded-full bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center mx-auto">
                <PhoneCall className="size-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Need Immediate Procurement Help?</h4>
              <p className="text-xs text-muted-foreground">
                For tenders, emergency site supplies, or orders over ৳1,000,000.
              </p>
              <Button asChild variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl border-border/80">
                <a href="tel:+8801700000000">Call Help Desk (+880) 1700-000000</a>
              </Button>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
}