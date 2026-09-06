"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Building2,
  ExternalLink,
  MessageCircle, // WhatsApp
  Facebook,
  Linkedin,
  Instagram,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [priority, setPriority] = useState<"standard" | "urgent" | "critical">("standard");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "general",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getSLA = () => {
    switch(priority) {
      case "critical": return { time: "Within 15 Minutes", text: "Emergency Site Supply Escalation", color: "text-red-500 bg-red-500/10 border-red-500/20" };
      case "urgent": return { time: "Within 1 Hour", text: "Priority Tender & RFQ Clearance", color: "text-[#FF5500] bg-[#FF5500]/10 border-[#FF5500]/20" };
      default: return { time: "Within 2-4 Hours", text: "Standard Business Response", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
    }
  };

  const currentSLA = getSLA();

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
            <span>Direct Industrial Support Desk</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]"
          >
            Let’s Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-[#FF5500]">SolveX Supply</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Have questions about industrial procurement, bulk pricing, or corporate supply contracts? Our team and directors are ready to assist you.
          </motion.p>

          {/* ================= SOCIAL CHANNELS BAR ================= */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 pt-2 flex-wrap"
          >
            <a 
              href="https://wa.me/8801352316931" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
            >
              <MessageCircle className="size-4" />
              <span>WhatsApp Direct</span>
            </a>

            <a 
              href="https://facebook.com/solvexsupply" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <Facebook className="size-4" />
              <span>Facebook</span>
            </a>

            <a 
              href="https://linkedin.com/company/solvexsupply" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-600/10 border border-sky-600/20 text-sky-600 dark:text-sky-400 text-xs font-bold hover:bg-sky-600 hover:text-white transition-all shadow-sm"
            >
              <Linkedin className="size-4" />
              <span>LinkedIn</span>
            </a>

            <a 
              href="https://instagram.com/solvexsupply" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold hover:bg-pink-500 hover:text-white transition-all shadow-sm"
            >
              <Instagram className="size-4" />
              <span>Instagram</span>
            </a>
          </motion.div>
        </div>

        {/* ================= 2. CONTACT INFO CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-6xl mx-auto">
          
          {/* Address */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-3 relative overflow-hidden group hover:border-[#FF5500]/50 transition-colors"
          >
            <div className="size-10 rounded-xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center shrink-0">
              <MapPin className="size-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">Head Office Address</h3>
              <p className="text-xs font-extrabold text-foreground leading-snug">
                Amanah Holy Tower <br />
                <span className="text-muted-foreground font-semibold">(Opposite of Dish Goli)</span><br />
                Sanir-Akhra, Jatrabari, Dhaka - 1362
              </p>
            </div>
            <a 
              href="https://maps.app.goo.gl/y5FVNcBbBT7s7PKH6" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] hover:underline pt-1"
            >
              <span>View Map</span>
              <ExternalLink className="size-3" />
            </a>
          </motion.div>

          {/* Phone */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-3 relative overflow-hidden group hover:border-[#FF5500]/50 transition-colors"
          >
            <div className="size-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
              <Phone className="size-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">Direct Hotline</h3>
              <p className="text-sm font-extrabold text-foreground">
                +88 01352316931
              </p>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                Sat – Thu: 9:00 AM – 7:00 PM
              </p>
            </div>
            <a 
              href="tel:+8801352316931" 
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline pt-1"
            >
              <span>Call Desk</span>
              <Phone className="size-3" />
            </a>
          </motion.div>

          {/* Email */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-3 relative overflow-hidden group hover:border-[#FF5500]/50 transition-colors"
          >
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Mail className="size-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">Official Email</h3>
              <p className="text-xs font-extrabold text-foreground truncate">
                contact@solvexsupply.com
              </p>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                Verified Industrial Desk
              </p>
            </div>
            <a 
              href="mailto:contact@solvexsupply.com" 
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:underline pt-1"
            >
              <span>Send Email</span>
              <Mail className="size-3" />
            </a>
          </motion.div>

          {/* Website */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-3 relative overflow-hidden group hover:border-[#FF5500]/50 transition-colors"
          >
            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <Globe className="size-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">Web Portal</h3>
              <p className="text-xs font-extrabold text-foreground truncate">
                www.solvexsupply.com
              </p>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                24/7 Procurement Platform
              </p>
            </div>
            <a 
              href="https://www.solvexsupply.com" 
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-500 hover:underline pt-1"
            >
              <span>Visit Portal</span>
              <Globe className="size-3" />
            </a>
          </motion.div>

        </div>

        {/* ================= 3. CONTACT FORM & UNIQUE ESCALATION FEATURE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
          
          {/* Main Inquiry Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7 rounded-3xl bg-card border border-border/70 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden"
          >
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4 bg-muted/20 rounded-2xl border border-emerald-500/30 p-6"
              >
                <div className="size-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-8" />
                </div>
                <h2 className="text-2xl font-black text-foreground">Inquiry Received & Escalated!</h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  Your response SLA is set to: <strong className="text-foreground">{currentSLA.time}</strong>. An official manager is assigned to handle your request.
                </p>

                {/* Instant Escalation CTA for Submitted Users */}
                <div className="pt-2">
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-5 rounded-xl gap-2">
                    <a href={`https://wa.me/8801352316931?text=Hi%20SolveX,%20I%20just%20submitted%20a%20${priority}%20inquiry%20for%20${formData.company}`} target="_blank" rel="noreferrer">
                      <MessageCircle className="size-4" />
                      <span>Ping Management on WhatsApp Now</span>
                    </a>
                  </Button>
                </div>

                <Button 
                  onClick={() => setSubmitted(false)} 
                  variant="outline" 
                  className="rounded-xl text-xs font-bold mt-2"
                >
                  Send Another Inquiry
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="border-b border-border/40 pb-3">
                  <h3 className="text-base font-black text-foreground">Send Official Communication</h3>
                  <p className="text-xs text-muted-foreground">Select priority level below to get instant guaranteed response timeline.</p>
                </div>

                {/* UNIQUE FEATURE: PRIORITY SLA SELECTOR */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Zap className="size-3.5 text-[#FF5500]" />
                    <span>Select Response SLA & Urgency:</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPriority("standard")}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        priority === "standard"
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                      }`}
                    >
                      Standard (2-4h)
                    </button>

                    <button
                      type="button"
                      onClick={() => setPriority("urgent")}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        priority === "urgent"
                          ? "bg-[#FF5500] text-white border-[#FF5500] shadow-sm"
                          : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                      }`}
                    >
                      Urgent RFQ (1h)
                    </button>

                    <button
                      type="button"
                      onClick={() => setPriority("critical")}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        priority === "critical"
                          ? "bg-red-600 text-white border-red-600 shadow-sm animate-pulse"
                          : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                      }`}
                    >
                      Emergency (15m)
                    </button>
                  </div>

                  {/* Dynamic SLA Badge Display */}
                  <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${currentSLA.color}`}>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      <span>Guaranteed SLA: {currentSLA.time}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider">{currentSLA.text}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Your Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Tanveer Hossain"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Company Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. SolveX Corp Ltd."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Phone / WhatsApp Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="+880 1352316931"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Inquiry Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about your required materials, quantity, or tender deadline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-background border border-border/70 focus:border-[#FF5500] rounded-xl p-3.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs sm:text-sm h-11 rounded-xl shadow-md shadow-[#FF5500]/20 gap-2"
                >
                  <Send className="size-4" />
                  <span>Submit Inquiry with SLA Commitment</span>
                </Button>

              </form>
            )}
          </motion.div>

          {/* Right Column: Interactive Map & Director Direct Escalation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct Executive Contact Box */}
            <div className="rounded-3xl bg-card border border-border/70 p-6 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border/40 pb-3">
                <div className="size-11 rounded-full bg-[#FF5500]/10 text-[#FF5500] font-black text-sm flex items-center justify-center border border-[#FF5500]/20">
                  SK
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-foreground">Sayem Kabir Saurav</h4>
                  <p className="text-xs text-[#FF5500] font-bold">Managing Director, SolveX Supply</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                For corporate partnership proposals, multi-million BDT tender negotiations, or executive escalations, reach out directly.
              </p>

              <div className="pt-1 flex flex-col gap-2">
                <Button asChild variant="outline" size="sm" className="w-full text-xs font-bold h-9 rounded-xl justify-start gap-2 border-border/80">
                  <a href="tel:+8801352316931">
                    <Phone className="size-3.5 text-blue-600" />
                    <span>Direct Call: +88 01352316931</span>
                  </a>
                </Button>

                <Button asChild variant="outline" size="sm" className="w-full text-xs font-bold h-9 rounded-xl justify-start gap-2 border-border/80">
                  <a href="mailto:contact@solvexsupply.com">
                    <Mail className="size-3.5 text-emerald-500" />
                    <span>Executive Email Desk</span>
                  </a>
                </Button>
              </div>
            </div>

            {/* Google Map Box */}
            <div className="rounded-3xl bg-card border border-border/70 overflow-hidden shadow-sm">
              <div className="p-3.5 border-b border-border/40 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-[#FF5500]" />
                  <span className="text-xs font-black text-foreground">Jatrabari Hub Location</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">Dhaka - 1362</span>
              </div>
              
              <div className="w-full h-52 bg-muted relative">
                <iframe
                  title="SolveX Office Location"
                  src="
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.0942999386866!2d90.4517782!3d23.7083263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b70049704563%3A0x690afb22bc86d0ba!2sSOLVEX!5e0!3m2!1sen!2sbd!4v1788290000073!5m2!1sen!2sbd                  "
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "contrast(1.05)" }}
                  allowFullScreen={false}
                  loading="lazy"
                />
                {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.0942999386866!2d90.4517782!3d23.7083263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b70049704563%3A0x690afb22bc86d0ba!2sSOLVEX!5e0!3m2!1sen!2sbd!4v1788290000073!5m2!1sen!2sbd" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe> */}
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
}