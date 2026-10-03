"use client";

import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Factory,
  ShieldCheck,
  Package,
  Wrench,
  Zap,
  Sparkles,
  ArrowUpRight,
  Boxes,
  Briefcase,
  Layers,
  Grid3X3,
  Tag,
  ShoppingBag,
  FileText,
  Building2,
  Truck,
  Users,
  Star,
  Crown,
  Gift,
  PenTool,
  Store,
  Rocket,
  Award,
  Loader2,
} from "lucide-react";

// 🔥 API Hook
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";

// 🔥 Icon Map — Admin Panel থেকে যেকোনো icon name পাঠালে এখানে match হবে
const ICON_MAP: Record<string, any> = {
  factory: Factory,
  shield: ShieldCheck,
  "shield-check": ShieldCheck,
  package: Package,
  boxes: Boxes,
  wrench: Wrench,
  zap: Zap,
  sparkles: Sparkles,
  briefcase: Briefcase,
  layers: Layers,
  grid: Grid3X3,
  tag: Tag,
  "shopping-bag": ShoppingBag,
  "file-text": FileText,
  "building": Building2,
  truck: Truck,
  users: Users,
  star: Star,
  crown: Crown,
  gift: Gift,
  pen: PenTool,
  store: Store,
  rocket: Rocket,
  award: Award,
};

// 🔥 Fallback icon
const getIcon = (iconName?: string) => {
  if (!iconName) return Package;
  const key = iconName.toLowerCase().trim();
  return ICON_MAP[key] || Package;
};

// 🔥 Fallback image (if admin doesn't provide)
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600";

// 🔥 Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
} as any;

export default function CategorySection() {
  // 🔥 API — Only active categories
  const { data: categoriesData, isLoading } = useGetAllCategoriesQuery();

  const categories = categoriesData?.data || [];

  // 🔥 Loading State
  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-background relative overflow-hidden border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header Skeleton */}
          <div className="mb-10 md:mb-14 space-y-3">
            <div className="h-6 w-40 bg-muted rounded-full animate-pulse" />
            <div className="h-12 w-96 bg-muted rounded-lg animate-pulse" />
            <div className="h-4 w-80 bg-muted rounded-lg animate-pulse" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 sm:h-72 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🔥 Empty State
  if (categories.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-background relative overflow-hidden border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Layers className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              No Categories Yet
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Categories will appear here once added from the admin panel.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden border-b border-border/40">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#FF5500]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* ============================================ */}
        {/* SECTION HEADER */}
        {/* ============================================ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-14 gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-[11px] font-extrabold uppercase tracking-widest shadow-inner">
              <Sparkles className="size-3 fill-current" />
              <span>Supply Solutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Explore Product{" "}
              <span className="text-[#0F52BA] dark:text-blue-400">
                Categories
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
              Direct procurement catalog tailored for industrial enterprises
              and verified corporate buyers.
            </p>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="sm:hidden self-end">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted/80 px-3 py-1.5 rounded-full border border-border/60 flex items-center gap-1.5 shadow-sm">
              <span>Swipe</span>
              <span className="animate-pulse text-[#FF5500]">➔</span>
            </span>
          </div>
        </div>

        {/* ============================================ */}
        {/* CATEGORIES GRID — DYNAMIC */}
        {/* ============================================ */}
        <motion.div
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-6 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none touch-pan-x"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((category: any) => {
            const Icon = getIcon(category.icon);
            const subcategoryCount = category.subcategoryCount || 0;
            const productCount = category.productCount || 0;
            const isFeatured = category.isFeatured || false;

            // 🔥 Build href with slug
            const href = `/products?category=${category.slug}`;

            return (
              <motion.div
                key={category._id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.96 }}
                className="snap-start shrink-0 w-[82vw] sm:w-auto"
              >
                <Link to={href} className="group block h-full">
                  <div
                    className={`relative h-64 sm:h-72 rounded-2xl p-6 transition-all duration-500 overflow-hidden border shadow-md group-hover:shadow-2xl ${
                      isFeatured
                        ? "border-[#FF5500]/60 shadow-[#FF5500]/10"
                        : "border-slate-200/80 dark:border-slate-800 hover:border-primary/50"
                    }`}
                  >
                    {/* ============================================ */}
                    {/* BACKGROUND IMAGE */}
                    {/* ============================================ */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={category.image || FALLBACK_IMAGE}
                        alt={category.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60 group-hover:via-slate-950/70 transition-colors duration-300" />
                    </div>

                    {/* ============================================ */}
                    {/* CONTENT LAYER */}
                    {/* ============================================ */}
                    <div className="flex flex-col justify-between h-full relative z-10 text-white">
                      {/* Top Row: Icon + Arrow + Count Badge */}
                      <div className="flex items-start justify-between">
                        <div
                          className={`p-3 rounded-xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 shadow-lg ${
                            isFeatured
                              ? "bg-[#FF5500] text-white shadow-[#FF5500]/40"
                              : "bg-white/10 text-white border border-white/20"
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>

                        {/* Subcategory + Product Count Badge */}
                        {subcategoryCount > 0 && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md text-white/90 border border-white/20 px-2 py-1 rounded-full">
                            {productCount > 0
                              ? `${productCount} Items`
                              : `${subcategoryCount} Sub`}
                          </span>
                        )}

                        <div className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white/80 group-hover:text-white group-hover:bg-[#FF5500] transition-all border border-white/10 ml-auto">
                          <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>

                      {/* Bottom Title & Description */}
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-base md:text-lg text-white group-hover:text-[#FF5500] transition-colors">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed font-normal">
                            {category.description}
                          </p>
                        )}

                        {/* Explore Link */}
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Explore <ArrowUpRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ============================================ */}
        {/* VIEW ALL BUTTON */}
        {/* ============================================ */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-10 md:mt-12"
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="size-4" />
              <span>View All Products</span>
              <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}