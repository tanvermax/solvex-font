// components/layout/HomeLayout/ProductCard/AdminProductCard.tsx
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface AdminProductCardProps {
    id: string;
    name: string;
    price: number;              // minPrice
    specialPrice?: number;
    hasDiscount?: boolean;
    inStock?: boolean;
    quantity?: number;           // totalStock, shown to admin only
    category?: string;
    image: string;               // single mainImage, not an array
    description?: string;        // optional: not present in card projection unless backend adds it
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void; // optional override — default behaviour navigates to an edit page
    isDeleting?: boolean;
}

export default function AdminProductCard({
    id,
   
    name,
    price,
    specialPrice,
    hasDiscount = false,
    inStock = true,
    quantity,
    category,
    image,
    description,
    onDelete,
    onEdit,
    isDeleting = false,
}: AdminProductCardProps) {
    const navigate = useNavigate();

    const handleDelete = () => {
        if (onDelete && window.confirm(`Are you sure you want to delete "${name}"?`)) {
            onDelete(id);
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(id);
        } else {
            // default: go to a dedicated edit page — adjust the path to match your router
            navigate(`/admin/products/edit/${id}`);
        }
    };

    const safePrice = price ?? 0;
    const displayPrice = hasDiscount && specialPrice != null ? specialPrice : safePrice;

    return (
        <div className="card bg-base-100 shadow-xl border rounded-2xl overflow-hidden relative">
            {!inStock && (
                <Badge variant="destructive" className="absolute top-2 left-2 z-10">
                    Out of stock
                </Badge>
            )}
            {category && (
                <Badge variant="secondary" className="absolute top-2 right-2 z-10">
                    {category}
                </Badge>
            )}
            <Badge variant="outline" className="absolute bg-[#FF6900] top-2 left-2 z-10">
                {id}
            </Badge>
            <img
                src={image || "https://via.placeholder.com/300"}
                alt={name}
                width={400}
                height={400}
                className="w-full h-[20vh] object-cover"
            />
            <div className="card-body p-4">
                <h2 className="card-title text-sm line-clamp-2">{name}</h2>
                {description && (
                    <p className="text-xs text-gray-600 truncate">{description}</p>
                )}
                <div className="flex items-center gap-2">
                    {hasDiscount && (
                        <span className="text-sm text-gray-500 line-through">
                            ৳{safePrice.toFixed(2)}
                        </span>
                    )}
                    <span className="text-base font-semibold text-red-600">
                        ৳{displayPrice.toFixed(2)}
                    </span>
                </div>
                {quantity != null && (
                    <p className="text-xs text-muted-foreground">Stock: {quantity}</p>
                )}
                <div className="card-actions flex justify-between gap-2 mt-2">
                    <Button
                        className="btn btn-sm flex-1"
                        variant="outline"
                        onClick={handleEdit}
                    >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                        className="btn btn-sm flex-1"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        variant="destructive"
                    >
                        {isDeleting ? (
                            <>Deleting... <Spinner /></>
                        ) : (
                            <><Trash2 className="h-4 w-4 mr-1" /> Delete</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}