"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
  Loader2,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 🔥 API Hooks
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetSubcategoriesByCategoryQuery } from "@/redux/features/subcategory/subcategory.api";
import ProductCard from "./ProductCard";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔥 State
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "ALL"
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    searchParams.get("subcategory") || "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // 🔥 API — Categories
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data || [];

  // 🔥 API — Subcategories (based on selected category)
  const { data: subcategoriesData } = useGetSubcategoriesByCategoryQuery(
    selectedCategory !== "ALL" ? selectedCategory : "",
    { skip: selectedCategory === "ALL" }
  );
  const subcategories = subcategoriesData?.data || [];

  // 🔥 API — Products
  const [sortByField, sortOrder] = sortBy.split("-");

  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useGetAllProductsQuery({
    searchTerm: searchQuery || undefined,
    categoryId: selectedCategory !== "ALL" ? selectedCategory : undefined,
    subcategoryId:
      selectedSubcategory !== "ALL" ? selectedSubcategory : undefined,
    minPrice: priceRange.min ? Number(priceRange.min) : undefined,
    maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
    page,
    limit: 12,
    sortBy: sortByField,
    sortOrder: sortOrder as "asc" | "desc",
  });

  const products = productsData?.data || [];
  const meta = productsData?.meta;

  // 🔥 Category helper
  const getCategoryName = (product: any) => {
    if (typeof product.categoryId === "object") {
      return product.categoryId.name;
    }
    return (
      categories.find((c) => c._id === product.categoryId)?.name || "Uncategorized"
    );
  };

  const getSubcategoryName = (product: any) => {
    if (typeof product.subcategoryId === "object") {
      return product.subcategoryId.name;
    }
    return "N/A";
  };

  // 🔥 Handle Category Change
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory("ALL");
    setPage(1);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (catId === "ALL") newParams.delete("category");
      else newParams.set("category", catId);
      newParams.delete("subcategory");
      return newParams;
    });
  };

  // 🔥 Handle Subcategory Change
  const handleSubcategoryChange = (subId: string) => {
    setSelectedSubcategory(subId);
    setPage(1);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (subId === "ALL") newParams.delete("subcategory");
      else newParams.set("subcategory", subId);
      return newParams;
    });
  };

  // 🔥 Clear All Filters
  const clearAllFilters = () => {
    setSelectedCategory("ALL");
    setSelectedSubcategory("ALL");
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    setSortBy("createdAt-desc");
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== "ALL" ||
    selectedSubcategory !== "ALL" ||
    searchQuery ||
    priceRange.min ||
    priceRange.max;

  // 🔥 Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#FF5500]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* ================= 1. HERO HEADER ================= */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10 md:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] text-[11px] font-extrabold uppercase tracking-widest">
            <Sparkles className="size-3.5 fill-current" />
            <span>Verified OEM Inventory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
            Enterprise Industrial{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-primary to-[#FF5500]">
              Supplies Catalog
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto">
            Direct factory procurement with tiered wholesale pricing, certified
            quality standards, and 24-hour quotation turnarounds.
          </p>
        </div>

        {/* ================= 2. SEARCH & FILTER BAR ================= */}
        <div className="bg-card/70 backdrop-blur-xl border border-border/70 rounded-2xl p-3 md:p-4 shadow-lg mb-8 md:mb-12 space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, specifications, or SKU..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-background border border-border/60 focus:border-[#FF5500] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Sort + Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 text-xs font-semibold rounded-xl border-border/60 w-full md:w-45">
                  <ArrowUpDown className="size-3.5 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A-Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z-A</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="h-10 text-xs font-semibold rounded-xl border-border/60 gap-1.5 md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="size-3.5 text-[#FF5500]" />
                Filters
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-border/40">
            <button
              onClick={() => handleCategoryChange("ALL")}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap ${
                selectedCategory === "ALL"
                  ? "bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/20"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat._id)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap ${
                  selectedCategory === cat._id
                    ? "bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/20"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Subcategory Pills (when a category is selected) */}
          {selectedCategory !== "ALL" && subcategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-border/40">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider shrink-0">
                Subcategory:
              </span>
              <button
                onClick={() => handleSubcategoryChange("ALL")}
                className={`text-[11px] font-semibold px-3 py-1 rounded-md transition-all shrink-0 whitespace-nowrap ${
                  selectedSubcategory === "ALL"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                All
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => handleSubcategoryChange(sub._id)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-md transition-all shrink-0 whitespace-nowrap ${
                    selectedSubcategory === sub._id
                      ? "bg-primary/10 text-primary"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          {/* Advanced Filters (Mobile + Desktop) */}
          {showFilters && (
            <div className="pt-3 border-t border-border/40 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => {
                    setPriceRange({ ...priceRange, min: e.target.value });
                    setPage(1);
                  }}
                  className="w-full mt-1 bg-background border border-border/60 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  value={priceRange.max}
                  onChange={(e) => {
                    setPriceRange({ ...priceRange, max: e.target.value });
                    setPage(1);
                  }}
                  className="w-full mt-1 bg-background border border-border/60 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="w-full text-xs"
                  >
                    <X className="size-3.5 mr-1.5" />
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Desktop Filter Toggle */}
          <div className="hidden md:flex items-center justify-between pt-2 border-t border-border/40">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <SlidersHorizontal className="size-3.5" />
              {showFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-destructive hover:underline flex items-center gap-1"
              >
                <X className="size-3.5" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ================= 3. RESULT COUNT ================= */}
        {meta && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">
                {products.length}
              </span>{" "}
              of <span className="font-bold text-foreground">{meta.total}</span>{" "}
              products
            </p>
            {isFetching && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        )}

        {/* ================= 4. PRODUCT GRID ================= */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-bold">No products found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            {hasActiveFilters && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="mt-4"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              <AnimatePresence mode="popLayout">
                {products.map((product: any) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group h-full"
                  >
                    <ProductCard
                      product={product}
                      getCategoryName={getCategoryName}
                      getSubcategoryName={getSubcategoryName}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ================= 5. PAGINATION ================= */}
            {meta && meta.totalPage > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: meta.totalPage }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === meta.totalPage ||
                        Math.abs(p - page) <= 1
                    )
                    .map((p, index, array) => (
                      <div key={p} className="flex items-center gap-1">
                        {index > 0 && array[index - 1] !== p - 1 && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={p === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(p)}
                          disabled={isFetching}
                          className={`min-w-9 rounded-lg ${
                            p === page ? "bg-primary text-white" : ""
                          }`}
                        >
                          {p}
                        </Button>
                      </div>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= meta.totalPage || isFetching}
                  className="rounded-lg"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* ================= 6. RFQ CALLOUT ================= */}
        <div className="mt-16 rounded-3xl p-6 sm:p-8 bg-linear-to-r from-blue-950/20 via-background to-[#FF5500]/10 backdrop-blur-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Can't find the exact specification you need?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Our enterprise sourcing team can procure custom OEM parts directly
              from verified international factories.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs sm:text-sm px-6 h-11 rounded-xl shadow-md shrink-0"
          >
            <Link to="/rfq">Submit Custom BOQ / RFQ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PRODUCT CARD COMPONENT
// ============================================
