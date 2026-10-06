// src/components/layout/HomeLayout/FeaturedProducts/FeaturedProducts.tsx
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

// 🔥 API Hooks
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";

// 🔥 Product Card Component
import ProductCard from "@/components/product/ProductCard";

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
  // 🔥 API — Only featured products
  const { data: productsData, isLoading } = useGetAllProductsQuery({
    isFeatured: true,
    page: 1,
    limit: 8,
  });

  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data || [];
  const products = productsData?.data || [];

  // 🔥 Category name resolver
  const getCategoryName = (product: any) => {
    if (typeof product.categoryId === "object") {
      return product.categoryId?.name;
    }
    return categories.find((c) => c._id === product.categoryId)?.name;
  };

  // ============================================
  // LOADING SKELETON
  // ============================================
  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-background/50 relative overflow-hidden border-b border-border/40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-14 gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="h-4 w-40 bg-muted rounded-full animate-pulse" />
              <div className="h-10 w-72 bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-96 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-9 w-32 bg-muted rounded-full animate-pulse" />
          </div>

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
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================
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
              Featured products will appear here once added from the admin panel.
            </p>
            <Button asChild className="mt-6">
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

  // ============================================
  // MAIN CONTENT
  // ============================================
  return (
    <section className="py-16 md:py-24 bg-background/50 relative overflow-hidden border-b border-border/40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
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

        {/* Products Grid — Using Standalone ProductCard */}
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
              {/* 🔥 ALADA COMPONENT — ProductCard */}
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