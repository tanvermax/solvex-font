import { Button } from "@/components/ui/button";
import ProductCard from '../ProductCard/ProductCard';
import { useAllpstockQuery } from "@/redux/features/product/product.api";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { IProductCard } from "@/redux/features/product/Product.types";

export default function NewProduct() {
    const { data, isLoading, isError } = useAllpstockQuery({ limit: 20, page: 1 },{
  refetchOnMountOrArgChange: true, // যতবার এই পেজে আসবে জোর করে নতুন ডেটা আনবে
});

    return (
        <div className="container mx-auto p-4">
            <div className="
            md:text-base text-[10px] px-2 flex
             justify-between items-center gap-4 my-10
            md:px-4 lg:px-6">
                <h1 className="
                text-xs md:text-2xl font-bold 
                ">
                    NEW PRODUCT
                </h1>
                <div>
                    <Link to={"/shop"}>
                        <Button className="md:text-md text-[10px]">
                            View All
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-10">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                         <Card key={i} className="w-full max-w-xs">
                             <CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader>
                             <CardContent><Skeleton className="aspect-square w-full" /></CardContent>
                         </Card>
                    ))
                ) : isError ? (
                    <p className="col-span-full text-center text-sm text-muted-foreground">
                        প্রোডাক্ট লোড করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।
                    </p>
                ) : !data?.data?.length ? (
                    <p className="col-span-full text-center text-sm text-muted-foreground">
                        কোনো প্রোডাক্ট পাওয়া যায়নি।
                    </p>
                ) : (
                    data.data.map((product: IProductCard) => (
                        <ProductCard
                            key={product._id}
                            id={product._id}
                            name={product.name}
                            price={product.minPrice ?? 0}
                            specialPrice={product.specialPrice}
                            hasDiscount={product.hasDiscount}
                            inStock={product.inStock}
                            image={product.mainImage || "https://via.placeholder.com/300"}
                            slug={product.slug}
                        />
                    ))
                )}
            </div>
            <div className="text-center ">
                <Link to={"/shop"}> <Button className="
                    md:text-md text-[10px]">
                    View All
                </Button></Link>
            </div>
        </div>
    );
}