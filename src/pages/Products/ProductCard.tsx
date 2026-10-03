import { Link } from "react-router";
import {
  FileText,
  ShoppingCart,
  Star,
  CheckCircle2,

  Package,

} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


export default function ProductCard({
  product,
  getCategoryName,
  getSubcategoryName,
}: {
  product: any;
  getCategoryName: (p: any) => string;
  getSubcategoryName: (p: any) => string;
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
    <div className="h-full rounded-2xl bg-card border border-border/60 hover:border-[#FF5500]/40 transition-all duration-300 p-4 flex flex-col justify-between shadow-sm hover:shadow-xl">
      <div>
        {/* Image */}
        <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-muted/40 mb-3.5 border border-border/30">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {hasDiscount && (
              <Badge className="bg-red-500 text-white text-[10px] font-bold border-0">
                {discountPercent}% OFF
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-yellow-500 text-white text-[10px] font-bold border-0">
                <Star className="size-2.5 mr-0.5 fill-current" />
                Featured
              </Badge>
            )}
          </div>

          {isLowStock && (
            <div className="absolute top-2.5 right-2.5">
              <Badge className="bg-orange-500 text-white text-[10px] font-bold border-0">
                Low Stock
              </Badge>
            </div>
          )}

          {!isInStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-red-500 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Category & Subcategory */}
        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
            {getCategoryName(product)}
          </span>
          <span className="text-[10px] text-muted-foreground">•</span>
          <span className="text-[10px] font-semibold text-primary">
            {getSubcategoryName(product)}
          </span>
        </div>

        {/* Name */}
        <Link
          to={`/products/${product.slug}`}
          className="block group/title"
        >
          <h3 className="font-bold text-sm text-foreground group-hover/title:text-[#FF5500] transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* SKU / Brand */}
        {(product.sku || product.brand) && (
          <p className="mt-1 text-[10px] text-muted-foreground font-mono">
            {product.sku && `SKU: ${product.sku}`}
            {product.sku && product.brand && " • "}
            {product.brand && product.brand}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3.5 border-t border-border/40 space-y-3">
        {/* Price */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-lg font-black text-foreground">
              ৳{displayPrice?.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground ml-1 font-medium">
              /{product.unit || "pc"}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-muted-foreground line-through ml-1.5">
                ৳{product.price?.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* MOQ + Stock */}
        <div className="flex items-center justify-between text-[10px]">
          {product.moq && (
            <span className="font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded font-bold">
              MOQ: {product.moq}
            </span>
          )}
          {isInStock ? (
            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <CheckCircle2 className="size-3" />
              In Stock
            </span>
          ) : (
            <span className="text-red-500 font-bold">Out of Stock</span>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="w-full text-xs font-bold h-9 rounded-xl border-border/70 hover:bg-muted/80 hover:border-[#FF5500]/30"
          >
            <Link
              to={`/rfq?product=${product._id}`}
              className="flex items-center justify-center gap-1.5"
            >
              <FileText className="size-3.5 text-[#FF5500]" />
              <span>Get RFQ</span>
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="w-full text-xs font-bold h-9 rounded-xl bg-[#FF5500] hover:bg-[#e04b00] text-white shadow-sm shadow-[#FF5500]/20"
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