import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ChevronRight,
  Star,
  Package,
  ShieldCheck,
  Truck,
  RefreshCw,
  FileText,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// 🔥 API Hooks & Components
import { useGetProductByIdentifierQuery } from "@/redux/features/product/product.api";
import OrderDialog from "@/components/order/OrderDialog";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop";

export default function ProductDetails() {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  // 🔥 Fetch Product from Backend
  const { data, isLoading, isError } = useGetProductByIdentifierQuery(
    identifier!,
    { skip: !identifier }
  );

  const product = data?.data;

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 mt-30 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground max-w-md mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => navigate("/products")}>Browse All Products</Button>
      </div>
    );
  }

  // ============================================
  // DATA PREPARATION
  // ============================================
  const images = product.images?.length > 0 ? product.images : [FALLBACK_IMAGE];
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const isInStock = product.isInStock !== false && (product.stock ?? 0) > 0;
  const isLowStock = (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 10;

  return (
    <div className="bg-background min-h-screen pb-20 mt-30">
      
      {/* ============================================ */}
      {/* BREADCRUMB */}
      {/* ============================================ */}
      <div className="border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-3 flex items-center text-xs text-muted-foreground overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 mx-2 shrink-0" />
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="h-3 w-3 mx-2 shrink-0" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          
          {/* ============================================ */}
          {/* LEFT: IMAGE GALLERY */}
          {/* ============================================ */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-border/50">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 text-white border-0 text-sm px-3 py-1 shadow-lg">
                    {discountPercent}% OFF
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ============================================ */}
          {/* RIGHT: PRODUCT INFO */}
          {/* ============================================ */}
          <div className="flex flex-col">
            
            {/* Category & SKU */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                {/* If categoryId is populated, it has a .name property */}
                {typeof product.categoryId === "object" 
                  ? (product.categoryId as any).name 
                  : "Industrial Supplies"}
              </span>
              {product.sku && (
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-amber-600">4.9</span>
              <span className="text-sm text-muted-foreground">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6 p-4 rounded-2xl bg-muted/30 border border-border/50">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-extrabold text-foreground">
                  ৳{displayPrice?.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through">
                    ৳{product.price?.toLocaleString()}
                  </span>
                )}
                <span className="text-sm text-muted-foreground ml-auto">
                  per {product.unit || "piece"}
                </span>
              </div>
              {product.moq && (
                <p className="text-sm font-medium text-orange-600 mt-2 flex items-center gap-1.5">
                  <Package className="h-4 w-4" />
                  Minimum Order Quantity (MOQ): {product.moq} {product.unit || "pcs"}
                </p>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.shortDescription}
              </p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              {isInStock ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1.5 text-sm gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge className="bg-red-500/10 text-red-600 border-red-500/20 px-3 py-1.5 text-sm gap-1.5">
                  <XCircle className="h-4 w-4" />
                  Out of Stock
                </Badge>
              )}
              {isLowStock && (
                <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 px-3 py-1.5 text-sm">
                  Only {product.stock} left!
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Button
                size="lg"
                className="h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20"
                disabled={!isInStock}
                onClick={() => setOrderDialogOpen(true)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isInStock ? "Order Now" : "Unavailable"}
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 text-base font-bold rounded-xl border-2"
              >
                <Link to={`/rfq?product=${product._id}`}>
                  <FileText className="mr-2 h-5 w-5 text-[#FF5500]" />
                  Request Quote (RFQ)
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-border/40">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-x border-border/40">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* TABS: DESCRIPTION & SPECIFICATIONS */}
        {/* ============================================ */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-border rounded-none space-x-6">
              <TabsTrigger
                value="description"
                className="text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-2 pb-3"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-2 pb-3"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-2 pb-3"
              >
                Reviews (128)
              </TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="pt-6">
              <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground">
                <p>
                  {product.description || "No description available for this product."}
                </p>
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="pt-6">
              {product.specifications && product.specifications.length > 0 ? (
                <div className="border border-border/50 rounded-xl overflow-hidden max-w-3xl">
                  <table className="w-full text-sm">
                    <tbody>
                      {product.specifications.map((spec: any, index: number) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-muted/30" : "bg-transparent"}
                        >
                          <td className="py-3 px-4 font-medium text-muted-foreground w-1/3 border-b border-border/40">
                            {spec.key}
                          </td>
                          <td className="py-3 px-4 text-foreground border-b border-border/40">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground py-4">No specifications provided.</p>
              )}
            </TabsContent>

            {/* Reviews Tab (Placeholder for now) */}
            <TabsContent value="reviews" className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/10 rounded-xl border border-dashed border-border/60">
                <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <h3 className="text-lg font-medium">Customer Reviews</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Review system coming soon.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 🔥 Order Dialog (Reused from ProductCard) */}
      <OrderDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        product={{
          _id: product._id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          moq: product.moq,
          stock: product.stock,
          unit: product.unit,
          sku: product.sku,
          image: images[0],
        }}
      />
    </div>
  );
}