"use client";
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ChevronLeft,
  ChevronRight, Info, Zap, ShoppingCart
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from '@/redux/hooks/useCart';
import { toast } from 'sonner';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { usePricestockDetailsQuery } from '@/redux/features/product/product.api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { IProductDetail, IProductVariant } from '@/redux/features/product/Product.types';

const ProductDetails = () => {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isLoading: isAddingToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImg, setActiveImg] = useState<number>(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);

  const { data: product, isLoading, refetch } = usePricestockDetailsQuery(id) as {
    data: IProductDetail | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  const activeVariants = useMemo(
    () => (product?.variants || []).filter(v => v.status === 'active'),
    [product]
  );
  const selectedVariant: IProductVariant | undefined = activeVariants[selectedVariantIdx];

  // gallery: main product images + the selected variant's own image(s), deduped
  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs = [
      product.mainImage,
      ...(product.images || []),
      selectedVariant?.image,
      ...(selectedVariant?.images || []),
    ];
    return Array.from(new Set(imgs.filter((img): img is string => Boolean(img))));
  }, [product, selectedVariant]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-10 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader><Skeleton className="h-8 w-2/3" /></CardHeader>
          <CardContent><Skeleton className="aspect-video w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  if (!product) return <div className="p-10 text-center text-red-500 font-bold">Product not found</div>;

  // price shown reflects the selected variant if one exists, otherwise the product's summary price
  const displayPrice = selectedVariant?.price ?? product.minPrice ?? 0;
  const displaySpecialPrice = selectedVariant?.specialPrice ?? product.specialPrice;
  const hasDiscount = displaySpecialPrice != null;
  const discountPercentage = hasDiscount
    ? Math.round(((displayPrice - (displaySpecialPrice as number)) / displayPrice) * 100)
    : 0;
  const inStock = selectedVariant ? selectedVariant.quantity > 0 : product.inStock;

  const handleAddToCart = async (showToast = true) => {
    try {
      await addToCart({
        userId: userInfo?.data?._id,
        productId: product._id,
        skuId: selectedVariant?.skuId,
        quantity: quantity,
        price: hasDiscount ? displaySpecialPrice : displayPrice,
        title: product.name,
        images: allImages,
      });
      refetch();
      if (showToast) toast.success('Added to cart!');
      return true;
    } catch (error) {
      console.error('addToCart failed:', error); // check browser console for the real reason
      toast.error('Failed to add product');
      return false;
    }
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart(false);
    if (success) {
      navigate('/cart'); // <-- confirm this exact path exists in your router config
    } else {
      toast.error('Could not proceed to checkout — please try again');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* GALLERY SECTION */}
        <div className="space-y-6">
          <div className="relative group rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-white">
            <img
              src={allImages[activeImg] || "/placeholder-image.png"}
              alt={product.name}
              className="w-full aspect-square object-contain transition-transform duration-700 group-hover:scale-105"
            />
            {allImages.length > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 shadow-xl"
                  onClick={() => setActiveImg(prev => prev === 0 ? allImages.length - 1 : prev - 1)}>
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 shadow-xl"
                  onClick={() => setActiveImg(prev => prev === allImages.length - 1 ? 0 : prev + 1)}>
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
            {!inStock && (
              <Badge variant="destructive" className="absolute top-4 left-4">Out of stock</Badge>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {allImages.map((img, idx) => (
              <button key={idx} onClick={() => setActiveImg(idx)}
                className={`relative flex-shrink-0 w-24 h-24 rounded-2xl border-4 transition-all overflow-hidden ${
                  activeImg === idx ? 'border-orange-500 scale-105' : 'border-transparent opacity-60'
                }`}>
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO SECTION */}
        <div className="flex flex-col space-y-8">
          <header className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none font-bold italic px-4">JCS EXCLUSIVE</Badge>
            <h1 className="text-xl md:text-xl font-semibold">
              {product.name}
            </h1>
            {product.nameBn && (
              <p className="text-muted-foreground font-medium text-lg">
                {product.nameBn}
              </p>
            )}
          </header>

          <div className="bg-secondary/30 p-8 rounded-[2rem] border-2 border-orange-100 flex items-center justify-between">
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="text-sm font-bold text-muted-foreground line-through italic">৳ {displayPrice}</span>
                  <span className="text-5xl font-black text-orange-600 italic tracking-tighter">৳ {displaySpecialPrice}</span>
                </>
              ) : (
                <span className="text-5xl font-black text-orange-600 italic tracking-tighter">৳ {displayPrice}</span>
              )}
            </div>
            {discountPercentage > 0 && (
              <div className="bg-red-600 text-white px-6 py-2 rounded-full font-black italic animate-pulse shadow-lg">
                -{discountPercentage}%
              </div>
            )}
          </div>

          {/* VARIANT PICKER — only shown if the product actually has more than one variant */}
          {activeVariants.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-black uppercase italic text-sm tracking-widest">Options</h3>
              <div className="flex flex-wrap gap-2">
                {activeVariants.map((v, idx) => (
                  <button
                    key={v.skuId}
                    onClick={() => { setSelectedVariantIdx(idx); setActiveImg(0); }}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                      selectedVariantIdx === idx
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-muted text-muted-foreground'
                    } ${v.quantity <= 0 ? 'opacity-40 line-through' : ''}`}
                    disabled={v.quantity <= 0}
                  >
                    {v.combo || v.skuId}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border-2 border-muted rounded-2xl bg-background h-16">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} className="px-6 h-full hover:bg-muted transition-colors">-</button>
              <span className="px-6 font-black text-2xl">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-6 h-full hover:bg-muted transition-colors">+</button>
            </div>

            <Button
              onClick={handleBuyNow}
              disabled={!inStock || isAddingToCart}
              className="flex-[2] h-16 bg-orange-500 hover:bg-orange-600 text-white font-black text-2xl rounded-2xl uppercase italic tracking-widest shadow-xl transition-all active:scale-95"
            >
              <Zap className="mr-2 fill-current" /> {inStock ? 'Buy Now' : 'Out of Stock'}
            </Button>

            <Button
              variant="outline"
              onClick={() => handleAddToCart(true)}
              disabled={!inStock || isAddingToCart}
              className="flex-1 h-16 border-2 border-primary text-primary font-bold rounded-2xl"
            >
              <ShoppingCart className="mr-2" /> + Cart
            </Button>
          </div>

          {product.highlights && (
            <div className="space-y-4 border-t pt-8">
              <h3 className="font-black uppercase italic text-sm tracking-widest flex items-center gap-2">
                <Info className="text-orange-500" /> Highlights
              </h3>
              <div className="prose prose-sm max-w-none text-muted-foreground italic font-medium"
                dangerouslySetInnerHTML={{ __html: product.highlights }} />
            </div>
          )}

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-4 border-t pt-8">
              <h3 className="font-black uppercase italic text-sm tracking-widest flex items-center gap-2">
                <Info className="text-orange-500" /> Specifications
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 pr-4 font-semibold text-muted-foreground">{key}</td>
                      <td className="py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {product.description && (
            <div className="space-y-4 border-t pt-8">
              <h3 className="font-black uppercase italic text-sm tracking-widest">Description</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;