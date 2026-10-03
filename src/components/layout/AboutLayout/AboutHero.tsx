// src/components/layout/AboutLayout/AboutHero.tsx
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Clock, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { fadeInUp, staggerContainer } from "./animations";

export default function AboutHero() {
  const trustSignals = [
    { label: "24h Quote SLA", icon: Clock },
    { label: "ISO 27001 Certified", icon: ShieldCheck },
    { label: "99.9% Uptime", icon: Activity },
  ];

  return (
    <section className="relative min-h-[85vh] md:mt-25 md:rounded-3xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a1628] to-slate-950">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(15, 82, 186, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15, 82, 186, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Radial Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-primary/20 rounded-full blur-[120px] md:blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-[#FF5500]/10 rounded-full blur-[120px] md:blur-[180px] pointer-events-none" />

      <div className="container mt-20 md:mt-0 mx-auto px-4 md:px-6 relative z-10 py-16 md:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          {/* Trust Badge */}
          <motion.div variants={fadeInUp} custom={0}>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-br from-primary to-blue-500 border-2 border-slate-950"
                  />
                ))}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-300">
                Trusted by 500+ Enterprise Clients
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            custom={1}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]"
          >
            Industrial Procurement,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-blue-500">
              Engineered for Enterprise.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed px-2"
          >
            We eliminate supply chain fragmentation with verified suppliers,
            guaranteed SLAs, and enterprise-grade compliance — so your teams
            can focus on building, not chasing vendors.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold rounded-xl h-12 px-6 md:px-8 shadow-2xl shadow-primary/30 group"
            >
              <Link to="/contactus" className="flex items-center justify-center gap-2">
                Request a Consultation
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/30 font-semibold rounded-xl h-12 px-6 md:px-8 backdrop-blur-md"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Watch 2-min Platform Tour
            </Button>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            variants={fadeInUp}
            custom={4}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-8 border-t border-white/10 max-w-2xl mx-auto"
          >
            {trustSignals.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-slate-400"
              >
                <item.icon className="h-4 w-4 text-emerald-400" />
                {item.label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}