"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { 
  Search, 
  SlidersHorizontal, 
  FileText, 
  ShoppingCart, 
  Star, 
  CheckCircle2, 
  Sparkles,
  ArrowUpDown,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock B2B Catalog Data
const CATEGORIES = ["All Supplies", "Safety & PPE", "Packaging", "Tools & Equipment", "Electrical"];

const PRODUCTS = [
  {
    id: "prod-1",
    name: "Heavy Duty Industrial Safety Helmet (ANSI Approved)",
    category: "Safety & PPE",
    price: "৳ 450",
    unit: "per pc",
    moq: "50 Pcs MOQ",
    rating: "4.9",
    reviews: 128,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
    tierDiscount: "Up to 15% off on 500+ pcs",
  },
  {
    id: "prod-2",
    name: "3-Ply Corrugated Heavy Duty Shipping Packaging Boxes",
    category: "Packaging",
    price: "৳ 28",
    unit: "per box",
    moq: "500 Pcs MOQ",
    rating: "4.8",
    reviews: 94,
    badge: "Bulk Stock",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=600&auto=format&fit=crop",
    tierDiscount: "Custom Printing Available",
  },
  {
    id: "prod-3",
    name: "Automated Digital Precision Vernier Caliper (0-150mm)",
    category: "Tools & Equipment",
    price: "৳ 2,800",
    unit: "per set",
    moq: "5 Sets MOQ",
    rating: "5.0",
    reviews: 67,
    badge: "Precision Tool",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop",
    tierDiscount: "Free Calibration Cert.",
  },
  {
    id: "prod-4",
    name: "High-Tension Industrial Electric Copper Cable (100m Roll)",
    category: "Electrical",
    price: "৳ 12,500",
    unit: "per roll",
    moq: "2 Rolls MOQ",
    rating: "4.9",
    reviews: 210,
    badge: "ISO Certified",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    tierDiscount: "Direct OEM Warranty",
  },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Supplies");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === "All Supplies" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#FF5500]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* ================= 1. FIRST SCREEN HERO & TYPOGRAPHY HEADER ================= */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10 md:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-[11px] font-extrabold uppercase tracking-widest">
            <Sparkles className="size-3.5 fill-current" />
            <span>Verified OEM Inventory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
            Enterprise Industrial <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-[#FF5500]">Supplies Catalog</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto">
            Direct factory procurement with tiered wholesale pricing, certified quality standards, and 24-hour quotation turnarounds.
          </p>
        </div>

        {/* ================= 2. HIGH-CONVERSION SEARCH & FILTER BAR ================= */}
        <div className="bg-card/70 backdrop-blur-xl border border-border/70 rounded-2xl p-3 md:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] mb-8 md:mb-12 space-y-3">
          
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, specifications, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border/60 focus:border-[#FF5500] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none transition-colors placeholder:text-muted-foreground/60"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between">
              <Button variant="outline" size="sm" className="h-10 text-xs font-semibold rounded-xl border-border/60 gap-1.5 flex-1 md:flex-initial">
                <SlidersHorizontal className="size-3.5 text-[#FF5500]" />
                <span>Filters</span>
              </Button>

              <Button variant="outline" size="sm" className="h-10 text-xs font-semibold rounded-xl border-border/60 gap-1.5 flex-1 md:flex-initial">
                <ArrowUpDown className="size-3.5 text-muted-foreground" />
                <span>Sort by: Featured</span>
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-border/40">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/20"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* ================= 3. CLEAN PRODUCT GRID WITH HIGH-HIERARCHY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group h-full"
              >
                <div className="h-full rounded-2xl bg-card border border-border/60 hover:border-[#FF5500]/40 transition-all duration-300 p-4 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_12px_35px_rgba(0,0,0,0.4)]">
                  
                  <div>
                    {/* Image Area with Crisp Visual Hierarchy */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted/40 mb-3.5 border border-border/30">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5">
                        <Badge className="bg-background/90 backdrop-blur-md text-foreground text-[10px] font-bold border border-border/60 shadow-sm px-2 py-0.5">
                          {product.badge}
                        </Badge>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className="flex items-center gap-1 bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-white/10">
                          <Star className="size-3 fill-amber-400" />
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    {/* Category & Verified Status */}
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1.5">
                      <span className="uppercase tracking-wide">{product.category}</span>
                      <span className="flex items-center gap-1 text-emerald-500 font-bold text-[10px]">
                        <CheckCircle2 className="size-3" /> Ready Stock
                      </span>
                    </div>

                    {/* Product Title (Optimized Typography) */}
                    <Link to={`/products/${product.id}`} className="block group/title">
                      <h3 className="font-extrabold text-sm sm:text-base text-foreground group-hover/title:text-[#FF5500] transition-colors line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Tier Discount Micro-Text */}
                    <p className="mt-1.5 text-[11px] font-semibold text-[#FF5500] bg-[#FF5500]/10 px-2 py-0.5 rounded w-fit">
                      {product.tierDiscount}
                    </p>
                  </div>

                  {/* Footer & Clear Conversion CTAs */}
                  <div className="mt-5 pt-3.5 border-t border-border/40 space-y-3">
                    
                    {/* Price Hierarchy */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-black text-foreground">{product.price}</span>
                        <span className="text-[11px] text-muted-foreground ml-1 font-medium">{product.unit}</span>
                      </div>

                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded font-bold">
                        {product.moq}
                      </span>
                    </div>

                    {/* High-Conversion Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button 
                        asChild 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs font-bold h-9 rounded-xl border-border/70 hover:bg-muted/80 transition-all hover:border-[#FF5500]/30"
                      >
                        <Link to={`/rfq?product=${product.id}`} className="flex items-center justify-center gap-1.5">
                          <FileText className="size-3.5 text-[#FF5500]" />
                          <span>Get RFQ</span>
                        </Link>
                      </Button>

                      <Button 
                        asChild 
                        size="sm" 
                        className="w-full text-xs font-bold h-9 rounded-xl bg-[#FF5500] hover:bg-[#e04b00] text-white transition-all shadow-sm shadow-[#FF5500]/20"
                      >
                        <Link to={`/products/${product.id}`} className="flex items-center justify-center gap-1.5">
                          <ShoppingCart className="size-3.5" />
                          <span>Order</span>
                        </Link>
                      </Button>
                    </div>

                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ================= 4. BOTTOM TRUST & RFQ CALLOUT ================= */}
        <div className="mt-16 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-950/20 via-background to-[#FF5500]/10 backdrop-blur-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Can't find the exact specification you need?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal">
              Our enterprise sourcing team can procure custom OEM parts directly from verified international factories.
            </p>
          </div>

          <Button 
            asChild 
            size="lg" 
            className="bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs sm:text-sm px-6 h-11 rounded-xl shadow-md shrink-0"
          >
            <Link to="/rfq">
              Submit Custom BOQ / RFQ
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}