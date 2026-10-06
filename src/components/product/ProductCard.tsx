// src/components/product/ProductCard.tsx
import { useState } from "react";
import { Link } from "react-router";
import {
  FileText,
  ShoppingCart,
  Star,
  Package,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OrderDialog from "@/components/order/OrderDialog";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop";

export interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug?: string;
    sku?: string;
    price: number;
    discountPrice?: number;
    unit?: string;
    moq?: number;
    stock?: number;
    isInStock?: boolean;
    images?: string[];
    categoryId?: any;
  };
  categoryName?: string;
}

export default function ProductCard({
  product,
  categoryName,
}: ProductCardProps) {
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  // ============================================
  // Pricing
  // ============================================
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100
      )
    : 0;

  const imageUrl = product.images?.[0] || null;
  const isInStock = product.isInStock !== false && (product.stock ?? 0) > 0;
  const isLowStock = (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 10;

  // ============================================
  // Order Handler
  // ============================================
  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock) {
      return;
    }

    setOrderDialogOpen(true);
  };

  return (
    <>
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

            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-2.5 left-2.5">
                <Badge className="bg-red-500 text-white text-[10px] font-bold border-0 shadow-md">
                  <Tag className="size-2.5 mr-1" />
                  {discountPercent}% OFF
                </Badge>
              </div>
            )}

            {/* Rating */}
            <div className="absolute top-2.5 right-2.5">
              <span className="flex items-center gap-1 bg-background/80 backdrop-blur-md text-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full border border-border/50 shadow-sm">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                4.9
              </span>
            </div>

            {/* Low Stock */}
            {isLowStock && (
              <div className="absolute bottom-2.5 left-2.5">
                <Badge className="bg-orange-500 text-white text-[10px] font-bold border-0">
                  Low Stock
                </Badge>
              </div>
            )}

            {/* Out of Stock */}
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
            {categoryName && (
              <span className="text-[11px] font-semibold text-muted-foreground/80 tracking-wide uppercase">
                {categoryName}
              </span>
            )}

            <Link to={`/products/${product.slug || product._id}`} className="block">
              <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>

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

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* RFQ Button */}
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

            {/* Order Button — Opens Dialog */}
            <Button
              size="sm"
              onClick={handleOrderClick}
              disabled={!isInStock}
              className="w-full text-xs font-semibold h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              <ShoppingCart className="size-3.5 mr-1.5" />
              <span>{isInStock ? "Order" : "Unavailable"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Order Dialog */}
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
          image: imageUrl || undefined,
        }}
      />
    </>
  );
}