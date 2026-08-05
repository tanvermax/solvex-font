"use client";

import React from "react";
import { motion } from "framer-motion";
import Logo from "@/assets/icons/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router";

const fadeInUp = {
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } }
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background overflow-hidden border-t border-border/60 transition-colors">
      
      {/* Dynamic Ambient Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#FF5500]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-4"
        >
          {/* Brand & Newsletter Column */}
          <motion.div variants={fadeInUp} className="lg:col-span-1 space-y-6">
            <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
              <Logo />
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed font-normal">
              Elevating the multifaceted lifestyle of Bangladesh. From the road to the home, we bring you authentic quality.
            </p>
            
            {/* Newsletter Input Box */}
            <div className="space-y-3">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF5500]">
                Join Our Newsletter
              </p>
              <div className="flex w-full max-w-sm items-center p-1 rounded-full bg-slate-900/5 dark:bg-slate-100/5 backdrop-blur-md border border-border/60 shadow-inner focus-within:border-primary/60 transition-all">
                <Input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="h-9 border-none bg-transparent text-xs placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-3.5" 
                />
                <Button size="sm" className="rounded-full h-9 w-9 p-0 shrink-0 bg-[#FF5500] hover:bg-[#e04b00] text-white shadow-md shadow-[#FF5500]/20 active:scale-95 transition-transform">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Dynamic Links Grid */}
          <motion.div variants={fadeInUp} className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterSection 
              title="Specialties" 
              links={[
                { name: "Automotive Gear", href: "/auto" },
                { name: "Feline Nutrition", href: "/pets" },
                { name: "Musical Gear", href: "/music" },
                { name: "Best Sellers", href: "/shop" },
              ]} 
            />
            <FooterSection 
              title="Customer Care" 
              links={[
                { name: "Track Order", href: "/track" },
                { name: "Shipping Policy", href: "/shipping" },
                { name: "Return Warranty", href: "/warranty" },
                { name: "Contact Us", href: "/help" },
              ]} 
            />
            
            {/* Contact Details */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" /> Reach Us
              </h4>
              <ul className="space-y-3.5 text-xs text-muted-foreground/90">
                <li className="flex gap-3 items-start group">
                  <div className="p-2 rounded-xl bg-muted/60 border border-border/40 text-primary shrink-0 transition-transform group-hover:scale-110">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="group-hover:text-foreground transition-colors leading-relaxed pt-0.5">
                    Shop 01, Sonirakhra, Dhaka 1362
                  </span>
                </li>
                <li className="flex gap-3 items-center group">
                  <div className="p-2 rounded-xl bg-muted/60 border border-border/40 text-primary shrink-0 transition-transform group-hover:scale-110">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="group-hover:text-foreground transition-colors font-mono font-medium">+8801674986600</span>
                </li>
                <li className="flex gap-3 items-center group">
                  <div className="p-2 rounded-xl bg-muted/60 border border-border/40 text-primary shrink-0 transition-transform group-hover:scale-110">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="group-hover:text-foreground transition-colors truncate">solvexsupply@gmail.com</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Dynamic Mission Banner (Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-[#FF5500]/20 to-primary/20 rounded-3xl blur-md opacity-30 group-hover:opacity-60 transition duration-500" />
          <div className="relative bg-slate-900/5 dark:bg-slate-100/5 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl text-center shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Our Mission</h3>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl mx-auto italic font-normal">
              &quot;To provide the Bangladeshi market with authentic products, competitive pricing, and a seamless shopping experience for the modern driver, pet parent, and creator.&quot;
            </p>
          </div>
        </motion.div>

        <Separator className="mt-12 bg-border/60" />

        {/* Final Bottom Bar */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-3 order-2 md:order-1">
             <SocialIcon icon={<Facebook />} href="https://www.facebook.com/share/1SDTmgM62M/" />
             <SocialIcon icon={<Instagram />} href="#" />
             <SocialIcon icon={<Twitter />} href="#" />
          </div>
          
          <p className="text-xs text-muted-foreground order-3 md:order-2 font-medium">
            © {currentYear} Solvex supply. Designed with Precision.
          </p>

          <div className="text-xs font-medium order-1 md:order-3">
             <span className="text-muted-foreground">Architected by </span>
             <a
               href="https://portfolio-e021a.web.app" 
               target="_blank"
               rel="noopener noreferrer"
               className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 transition-colors"
             >
               Shafayet Hossain Tanveer
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Sub-components for cleaner code */

function FooterSection({ title, links }: { title: string, links: { name: string, href: string }[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.name}>
            <Link 
              to={link.href} 
              className="group text-xs text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-1"
            >
              <ChevronRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#FF5500]" />
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-2.5 rounded-xl bg-slate-900/5 dark:bg-slate-100/5 border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 active:scale-90 transition-all shadow-sm"
    >
      {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4" } as any)}
    </a>
  );
}