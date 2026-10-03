// src/components/layout/AboutLayout/FinalCTASection.tsx
import { motion } from "framer-motion";
import { ArrowRight, Calendar, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { fadeInUp, staggerContainer } from "./animations";

export default function FinalCTASection() {
  return (
    <section className="relative py-16 md:py-24 lg:py-28 bg-gradient-to-br from-slate-950 via-[#0a1628] to-slate-950 overflow-hidden">
      {/* Glows */}
      <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[120px] md:blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#FF5500]/10 rounded-full blur-[120px] md:blur-[180px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <motion.h2
            variants={fadeInUp}
            custom={0}
            className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight px-2"
          >
            Let's Build Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">
              Procurement Advantage.
            </span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            custom={1}
            className="text-sm md:text-base lg:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed px-2"
          >
            No commitment. No pressure. Just a 30-minute conversation to
            understand your supply chain challenges and explore if we're the
            right fit.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            custom={2}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold rounded-xl h-12 px-6 md:px-8 shadow-2xl shadow-primary/30 group"
            >
              <Link to="/contactus" className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                Book Free Consultation
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-white/5 text-white border-white/20 hover:bg-white/10 font-semibold rounded-xl h-12 px-6 md:px-8 backdrop-blur-md"
            >
              <Link to="/contactus" className="flex items-center justify-center gap-2">
                <PhoneCall className="h-4 w-4" />
                Talk to Sales
              </Link>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            custom={3}
            className="text-[11px] md:text-xs text-slate-500 font-medium pt-2"
          >
            Average response time: under 24 hours • No credit card required
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}