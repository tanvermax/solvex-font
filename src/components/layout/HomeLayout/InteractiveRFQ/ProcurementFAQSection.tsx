"use client";

import { motion } from "framer-motion";
import { Link } from "react-router";
import { 
  HelpCircle, 
  PhoneCall, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    id: "item-1",
    question: "How does the RFQ (Request for Quotation) process work?",
    answer: "You can add multiple bulk products to your RFQ Basket or upload a Bill of Quantities (BOQ) document. Our dedicated procurement managers analyze your request and send a detailed, tax-compliant official quote within 24 hours.",
  },
  {
    id: "item-2",
    question: "Do you offer corporate credit facilities and VAT invoicing?",
    answer: "Yes, verified corporate buyers and registered enterprise accounts are eligible for 30 to 90-day credit payment terms. All transactions come with standard VAT/TAX compliant invoices.",
  },
  {
    id: "item-3",
    question: "What is the Minimum Order Quantity (MOQ) for custom factory imports?",
    answer: "MOQs vary by product category and OEM factory standards. Specific MOQs are explicitly listed on product cards. For custom sourcing, our sourcing team negotiates the lowest feasible MOQs directly with manufacturers.",
  },
  {
    id: "item-4",
    question: "How do you ensure product quality and factory standards?",
    answer: "Every single item in our catalog undergoes rigorous quality control inspections. We partner exclusively with ISO-certified OEM manufacturers and offer complete pre-shipment inspection reports upon request.",
  },
];

export default function ProcurementFAQSection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden border-b border-border/40">
      
      {/* Dynamic Ambient Glass Glows */}
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-[#FF5500]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Title & Support Desk Card */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[#FF5500] text-xs font-bold uppercase tracking-widest shadow-inner">
                <Sparkles className="size-3.5 fill-[#FF5500]" />
                <span>Help & Assistance</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-blue-600 via-primary to-[#FF5500] bg-clip-text text-transparent block">
                  Questions.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                Everything you need to know about enterprise supply chains, custom sourcing, and corporate credit terms.
              </p>
            </div>

            {/* Direct Support Desk Card (Glassmorphism) */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="p-6 rounded-2xl border border-white/20 dark:border-slate-800 bg-slate-900/5 dark:bg-slate-100/5 backdrop-blur-xl shadow-xl space-y-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/20">
                  <PhoneCall className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Need Urgent Procurement Support?</h4>
                  <p className="text-xs text-muted-foreground">Our desk is live Sun-Thu, 9 AM - 7 PM.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Button 
                  asChild 
                  size="sm" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-10 rounded-xl active:scale-95 transition-transform"
                >
                  <a href="tel:+8801674986600" className="flex items-center justify-center gap-2">
                    <PhoneCall className="size-3.5" />
                    <span>Call Hotline</span>
                  </a>
                </Button>

                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full font-semibold text-xs h-10 rounded-xl border-border/80 hover:bg-muted active:scale-95 transition-transform"
                >
                  <Link to="/rfq" className="flex items-center justify-center gap-1.5">
                    <MessageSquare className="size-3.5 text-[#FF5500]" />
                    <span>Live RFQ Desk</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Glassmorphism Accordion */}
          <div className="lg:col-span-7">
            <Accordion type="single" collapsible className="w-full space-y-3.5">
              {FAQS.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-slate-200/60 dark:border-slate-800/80 bg-slate-900/5 dark:bg-slate-100/5 backdrop-blur-md rounded-2xl px-5 transition-all duration-300 data-[state=open]:border-primary/50 data-[state=open]:bg-slate-900/10 dark:data-[state=open]:bg-slate-100/10 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors py-4 sm:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 pr-2">
                      <HelpCircle className="size-4.5 text-[#FF5500] shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed pt-1 pb-5 border-t border-border/30">
                    <div className="flex gap-2">
                      <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p>{faq.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>

      </div>
    </section>
  );
}