"use client";

import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  FileText,
  ShoppingCart,
  ArrowRight,
  Star,
  Zap,
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 🔥 API Hook
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";

// 🔥 Animation Variants
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

// 🔥 Fallback Image
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop";

export default function FeaturedProductsSection() {
  // 🔥 API — Only featured products
  const { data: productsData, isLoading } = useGetAllProductsQuery({
    isFeatured: true,
    page: 1,
    limit: 8,
  });


  

  // 🔥 API — Categories (for name mapping)
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data || [];

  const products = productsData?.data || [];

  // 🔥 Get category name
  const getCategoryName = (product: any) => {
    if (typeof product.categoryId === "object") {
      return product.categoryId.name;
    }
    return (
      categories.find((c) => c._id === product.categoryId)?.name ||
      "Uncategorized"
    );
  };

  // 🔥 ============================================
  // 🔥 LOADING SKELETON
  // 🔥 ============================================
  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-background/50 relative overflow-hidden border-b border-border/40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-14 gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="h-4 w-40 bg-muted rounded-full animate-pulse" />
              <div className="h-10 w-72 bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-96 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-9 w-32 bg-muted rounded-full animate-pulse" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-card border border-border/50 p-4 space-y-4"
              >
                <div className="aspect-[5/4] rounded-xl bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </div>
                <div className="pt-4 border-t border-border/40 space-y-3">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 bg-muted rounded-lg animate-pulse" />
                    <div className="h-9 bg-muted rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🔥 ============================================
  // 🔥 EMPTY STATE
  // 🔥 ============================================
  if (products.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-background/50 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              No Featured Products Yet
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Featured products will appear here once added from the admin
              panel.
            </p>
            <Button asChild className="mt-6 bg-primary hover:bg-primary/90">
              <Link to="/products">
                Browse All Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // 🔥 ============================================
  // 🔥 MAIN CONTENT
  // 🔥 ============================================
  return (
    <section className="py-16 md:py-24 bg-background/50 relative overflow-hidden border-b border-border/40">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* ============================================ */}
        {/* CLEAN HEADER */}
        {/* ============================================ */}
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

          <Button
            asChild
            variant="ghost"
            className="self-start sm:self-auto text-xs font-semibold text-muted-foreground hover:text-foreground group"
          >
            <Link to="/products" className="flex items-center gap-1.5">
              <span>View Catalog</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* ============================================ */}
        {/* PRODUCTS GRID — DYNAMIC */}
        {/* ============================================ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-6 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none"
        >
          {products.map((product: any) => (
            <motion.div
              key={product._id}
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
              className="snap-start shrink-0 w-[78vw] sm:w-auto h-full"
            >
              <ProductCard
                product={product}
                categoryName={getCategoryName(product)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// PRODUCT CARD COMPONENT
// ============================================
function ProductCard({
  product,
  categoryName,
}: {
  product: any;
  categoryName: string;
}) {
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  const imageUrl = product.images?.[0] || null;
  const isInStock = product.isInStock && product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="group h-full rounded-2xl bg-card border border-border/50 hover:border-border transition-all duration-300 p-4 flex flex-col justify-between shadow-sm hover:shadow-lg">
      <div>
        {/* ============================================ */}
        {/* IMAGE */}
        {/* ============================================ */}
        <div className="relative aspect-[5/4] rounded-xl overflow-hidden bg-muted/50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Top Left — Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2.5 left-2.5">
              <Badge className="bg-red-500 text-white text-[10px] font-bold border-0 shadow-md">
                <Tag className="size-2.5 mr-1" />
                {discountPercent}% OFF
              </Badge>
            </div>
          )}

          {/* Top Right — Rating Badge */}
          <div className="absolute top-2.5 right-2.5">
            <span className="flex items-center gap-1 bg-background/80 backdrop-blur-md text-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full border border-border/50 shadow-sm">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              4.9
            </span>
          </div>

          {/* Low Stock Badge */}
          {isLowStock && (
            <div className="absolute bottom-2.5 left-2.5">
              <Badge className="bg-orange-500 text-white text-[10px] font-bold border-0">
                Low Stock
              </Badge>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!isInStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-xs bg-red-500 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CATEGORY & TITLE */}
        {/* ============================================ */}
        <div className="space-y-1 mt-4">
          <span className="text-[11px] font-semibold text-muted-foreground/80 tracking-wide uppercase">
            {categoryName}
          </span>

          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* SKU */}
          {product.sku && (
            <p className="text-[10px] text-muted-foreground font-mono">
              SKU: {product.sku}
            </p>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <div className="mt-5 pt-3.5 border-t border-border/40 space-y-3">
        {/* Price & MOQ */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-lg font-bold text-foreground">
              ৳{displayPrice?.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground ml-1">
              per {product.unit || "piece"}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-muted-foreground line-through ml-1.5">
                ৳{product.price?.toLocaleString()}
              </span>
            )}
          </div>

          {product.moq && (
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono font-medium">
              MOQ: {product.moq}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-1.5 text-[10px]">
          {isInStock ? (
            <>
              <CheckCircle2 className="size-3 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">
                In Stock
              </span>
            </>
          ) : (
            <>
              <XCircle className="size-3 text-red-500" />
              <span className="text-red-600 font-semibold">
                Out of Stock
              </span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="w-full text-xs font-semibold h-9 rounded-lg border-border/70 hover:bg-muted/80 transition-colors"
          >
            <Link
              to={`/rfq?product=${product._id}`}
              className="flex items-center justify-center gap-1.5"
            >
              <FileText className="size-3.5 text-[#FF5500]" />
              <span>RFQ</span>
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="w-full text-xs font-semibold h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Link
              to={`/products/${product.slug}`}
              className="flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="size-3.5" />
              <span>Order</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

