import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { Heart } from "lucide-react";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    specialPrice?: number;
    hasDiscount: boolean;
    inStock: boolean;
    image: string;
    slug?: string;
}

export default function ProductCard({
    id,
    name,
    price,
    specialPrice,
    hasDiscount,
    inStock,
    image,
    slug,
}: ProductCardProps) {
    const displayPrice =
        hasDiscount && specialPrice != null ? specialPrice : price;

    const discount =
        hasDiscount && specialPrice
            ? Math.round(((price - specialPrice) / price) * 100)
            : 0;

    return (
        <Link to={`/alldata/${id || slug}`}>
            <Card className="group overflow-hidden rounded-2xl border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">

                    <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <Badge className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-1 text-white">
                            -{discount}%
                        </Badge>
                    )}

                    {/* Stock */}
                    {!inStock && (
                        <Badge
                            variant="destructive"
                            className="absolute bottom-3 left-3 rounded-full"
                        >
                            Out of Stock
                        </Badge>
                    )}

                    {/* Wishlist */}
                    <button
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition hover:bg-white"
                        onClick={(e) => e.preventDefault()}
                    >
                        <Heart
                            size={18}
                            className="text-gray-600 transition hover:fill-red-500 hover:text-red-500"
                        />
                    </button>
                </div>

                {/* Content */}
                <CardContent className="space-y-2 p-4">

                    <h3 className="line-clamp-2 min-h-[48px] text-sm font-medium leading-6 text-gray-800 transition-colors group-hover:text-primary">
                        {name}
                    </h3>

                </CardContent>

                {/* Footer */}
                <CardFooter className="flex items-center justify-between p-4 pt-0">

                    <div className="flex flex-col">

                        <span className="text-lg font-bold text-primary">
                            ৳{displayPrice.toLocaleString()}
                        </span>

                        {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through">
                                ৳{price.toLocaleString()}
                            </span>
                        )}

                    </div>

                    {inStock ? (
                        <Badge
                            variant="secondary"
                            className="rounded-full text-white bg-[#FF6900] px-3 py-1"
                        >
                            In Stock
                        </Badge>
                    ) : (
                        <Badge
                            variant="destructive"
                            className="rounded-full px-3 py-1"
                        >
                            Sold Out
                        </Badge>
                    )}

                </CardFooter>

            </Card>
        </Link>
    );
}