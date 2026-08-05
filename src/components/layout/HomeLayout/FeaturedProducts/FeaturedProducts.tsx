"use client";

import { Link } from "react-router";
import { motion } from "framer-motion";
import { 
  FileText, 
  ShoppingCart, 
  ArrowRight, 
  Star,
  Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURED_PRODUCTS = [
  {
    id: "prod-1",
    name: "Heavy Duty Industrial Safety Helmet",
    category: "Safety & PPE",
    price: "৳ 450",
    unit: "per piece",
    moq: "50 Pcs MOQ",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
    href: "/products/prod-1",
  },
  {
    id: "prod-2",
    name: "3-Ply Corrugated Shipping Packaging Boxes",
    category: "Packaging Materials",
    price: "৳ 28",
    unit: "per box",
    moq: "500 Pcs MOQ",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=600&auto=format&fit=crop",
    href: "/products/prod-2",
  },
  // {
  //   id: "prod-3",
  //   name: "Automated Digital Precision Vernier Caliper",
  //   category: "Tools & Equipment",
  //   price: "৳ 2,800",
  //   unit: "per set",
  //   moq: "5 Sets MOQ",
  //   rating: "5.0",
  //   image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop",
  //   href: "/products/prod-3",
  // },
  {
    id: "prod-4",
    name: "High-Tension Industrial Electric Cables (100m)",
    category: "Electrical & Power",
    price: "৳ 12,500",
    unit: "per roll",
    moq: "2 Rolls MOQ",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    href: "/products/prod-4",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
} as any;

export default function FeaturedProductsSection() {
  return (
    <section className="py-16 md:py-24 bg-background/50 relative overflow-hidden border-b border-border/40">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-14 gap-4">
          <div className="space-y-2 max-w-xl">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF5500] flex items-center gap-1.5">
              <Zap className="size-3.5 fill-current" />
              Enterprise Supplies
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal">
              Direct factory procurement with tier-based wholesale pricing.
            </p>
          </div>

          <Button asChild variant="ghost" className="self-start sm:self-auto text-xs font-semibold text-muted-foreground hover:text-foreground group">
            <Link to="/products" className="flex items-center gap-1.5">
              <span>View Catalog</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Minimal Grid with Premium Shadows */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-6 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none"
        >
          {FEATURED_PRODUCTS.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
              className="snap-start shrink-0 w-[78vw] sm:w-auto h-full"
            >
              <div className="group h-full rounded-2xl bg-card border border-border/50 hover:border-border transition-all duration-300 p-4 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
                
                <div>
                  {/* Clean Image Card */}
                  <div className="relative aspect-[5/4] rounded-xl overflow-hidden bg-muted/50 ">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    
                    {/* Top Right Rating Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="flex items-center gap-1 bg-background/80 backdrop-blur-md text-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full border border-border/50 shadow-sm">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  {/* Category & Title */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground/80 tracking-wide uppercase">
                      {product.category}
                    </span>

                    <Link to={product.href} className="block">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="mt-5 pt-3.5 border-t border-border/40 space-y-3">
                  
                  {/* Price & MOQ */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-bold text-foreground">{product.price}</span>
                      <span className="text-[11px] text-muted-foreground ml-1">{product.unit}</span>
                    </div>

                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono font-medium">
                      {product.moq}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button 
                      asChild 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs font-semibold h-9 rounded-lg border-border/70 hover:bg-muted/80 transition-colors"
                    >
                      <Link to={`/rfq?product=${product.id}`} className="flex items-center justify-center gap-1.5">
                        <FileText className="size-3.5 text-[#FF5500]" />
                        <span>RFQ</span>
                      </Link>
                    </Button>

                    <Button 
                      asChild 
                      size="sm" 
                      className="w-full text-xs font-semibold h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <Link to={product.href} className="flex items-center justify-center gap-1.5">
                        <ShoppingCart className="size-3.5" />
                        <span>Order</span>
                      </Link>
                    </Button>
                  </div>

                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}