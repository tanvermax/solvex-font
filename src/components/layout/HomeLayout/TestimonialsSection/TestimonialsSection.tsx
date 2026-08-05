"use client";

import { motion } from "framer-motion";
import { 
  Star, 
  Quote, 
  Building2, 
  CheckCircle2, 
  Building,
  Sparkles 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample B2B Client Reviews
const REVIEWS = [
  {
    id: "rev-1",
    name: "Tanvir Ahmed",
    role: "Head of Procurement",
    company: "Apex Textile Mills Ltd.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "SolveX has revolutionized our safety gear and industrial packaging sourcing. Their 24-hour RFQ response time and seamless VAT-compliant billing saved us over 15% annually.",
    verified: true,
  },
  {
    id: "rev-2",
    name: "Farhan Masud",
    role: "Factory Operations Manager",
    company: "Delta Heavy Auto Components",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "The custom sourcing engine is top-tier. We needed imported precision machinery spare parts, and SolveX delivered factory-direct within guaranteed timelines with zero hassle.",
    verified: true,
  },
  {
    id: "rev-3",
    name: "Nusrat Jahan",
    role: "Supply Chain Lead",
    company: "Innova Tech Solutions",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Consistent quality and unmatched reliability. Their mobile-friendly RFQ platform allows me to approve quotations and request bulk orders directly from my phone on-site.",
    verified: true,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      
      {/* Background Soft Glow Effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#FF5500]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[#FF5500] text-xs font-bold uppercase tracking-widest shadow-inner">
            <Sparkles className="size-3.5 fill-[#FF5500]" />
            Enterprise Validation
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Trusted by Procurement Leaders
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            See how top enterprise buyers across Bangladesh optimize their supply chain with SolveX.
          </p>
        </div>

        {/* 
          Mobile: Smooth Horizontal Touch-Swipe Carousel (snap-x)
          Desktop: Responsive 3-Column Glassmorphism Grid
        */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-6 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-none">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileTap={{ scale: 0.98 }}
              className="snap-start shrink-0 w-[85vw] xs:w-[320px] lg:w-auto"
            >
              <div className="group relative flex flex-col justify-between h-full rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-900/5 dark:bg-slate-100/5 hover:bg-slate-900/10 dark:hover:bg-slate-100/10 backdrop-blur-xl p-6 sm:p-7 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                
                {/* Quote Icon Background Accent */}
                <Quote className="absolute top-6 right-6 size-10 text-muted/20 group-hover:text-primary/10 transition-colors pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Comment Body */}
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Reviewer Profile Footer */}
                <div className="mt-6 pt-5 border-t border-border/40 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border border-primary/20">
                      <AvatarImage src={review.avatar} alt={review.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {review.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
                          {review.name}
                        </h4>
                        {review.verified && (
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium line-clamp-1">
                        {review.role}
                      </p>
                    </div>
                  </div>

                  {/* Company Tag */}
                  <div className="p-2 rounded-xl bg-muted/60 border border-border/40 text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                    <Building2 className="size-4" />
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Trust Banner below reviews */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/40 backdrop-blur-md border border-border/50 text-xs font-semibold text-muted-foreground">
            <Building className="size-4 text-emerald-500" />
            <span>Over <strong>1,200+ Verified Industrial Buyers</strong> rely on SolveX every month.</span>
          </div>
        </div>

      </div>
    </section>
  );
}