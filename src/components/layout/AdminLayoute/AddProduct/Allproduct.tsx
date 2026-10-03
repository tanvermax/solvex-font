// src/components/layout/AdminLayoute/Allproduct.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  RefreshCw,
  Eye,
  Grid3X3,
  List,
  Star,
  CheckCircle2,
  XCircle,
  Filter,
  TrendingUp,
  DollarSign,
  Boxes,
  LayoutGrid,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🔥 API Hooks
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/redux/features/product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";

// 🔥 Icons
import { Loader2 } from "lucide-react";

export default function Allproduct() {
  const navigate = useNavigate();

  // 🔥 State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 🔥 API
  const { data: categoriesData } = useGetAllCategoriesQuery();

  const {
    data: productsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllProductsQuery({
    searchTerm: searchTerm || undefined,
    categoryId: categoryFilter !== "ALL" ? categoryFilter : undefined,
    page,
    limit: 12,
    includeInactive: statusFilter === "INACTIVE" ? true : undefined,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const products = productsData?.data || [];
  const meta = productsData?.meta;
  const categories = categoriesData?.data || [];

  // 🔥 Filter by status (frontend)
  const filteredProducts = products.filter((product: any) => {
    if (statusFilter === "ACTIVE" && !product.isActive) return false;
    if (statusFilter === "INACTIVE" && product.isActive) return false;
    if (statusFilter === "FEATURED" && !product.isFeatured) return false;
    if (statusFilter === "OUT_OF_STOCK" && product.isInStock) return false;
    if (statusFilter === "LOW_STOCK" && product.stock > 10) return false;
    return true;
  });

  // 🔥 Handle Delete
  const handleDeleteClick = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct._id).unwrap();
      toast.success("Product deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  // 🔥 Handle Featured Toggle
  const handleFeaturedToggle = async (product: any) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          isFeatured: !product.isFeatured,
        })
      );

      await updateProduct({
        id: product._id,
        data: formData,
      }).unwrap();
      toast.success(
        `Product ${product.isFeatured ? "removed from" : "added to"} featured`
      );
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update product");
    }
  };

  // 🔥 Get Category Name
  const getCategoryName = (product: any) => {
    if (typeof product.categoryId === "object") {
      return product.categoryId.name;
    }
    return categories.find((c) => c._id === product.categoryId)?.name || "N/A";
  };

  // 🔥 Get Subcategory Name
  const getSubcategoryName = (product: any) => {
    if (typeof product.subcategoryId === "object") {
      return product.subcategoryId.name;
    }
    return "N/A";
  };

  // 🔥 Stats
  const stats = {
    total: meta?.total || 0,
    active: products.filter((p: any) => p.isActive).length,
    featured: products.filter((p: any) => p.isFeatured).length,
    outOfStock: products.filter((p: any) => !p.isInStock || p.stock === 0).length,
  };

  // 🔥 Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-b from-background to-background/50 min-h-screen">
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            All Products
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product catalog ({meta?.total || 0} total)
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate("/admin/add-product")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* ============================================ */}
      {/* STATS */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Total Products
                </p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Boxes className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Active
                </p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {stats.active}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Featured
                </p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">
                  {stats.featured}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {stats.outOfStock}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* FILTERS */}
      {/* ============================================ */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, brand..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="FEATURED">Featured</SelectItem>
                <SelectItem value="LOW_STOCK">Low Stock (≤10)</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg self-start">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 px-3"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================ */}
      {/* CONTENT */}
      {/* ============================================ */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm || categoryFilter !== "ALL" || statusFilter !== "ALL"
                    ? "Try adjusting your filters"
                    : "Get started by adding your first product"}
                </p>
              </div>
              <Button
                onClick={() => navigate("/admin/add-product")}
                className="mt-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        // ============================================
        // GRID VIEW
        // ============================================
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product: any) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={() => navigate(`/admin/products/edit/${product._id}`)}
              onDelete={() => handleDeleteClick(product)}
              onFeaturedToggle={() => handleFeaturedToggle(product)}
              getCategoryName={getCategoryName}
              getSubcategoryName={getSubcategoryName}
            />
          ))}
        </div>
      ) : (
        // ============================================
        // TABLE VIEW
        // ============================================
        <ProductTable
          products={filteredProducts}
          onEdit={(p) => navigate(`/admin/products/edit/${p._id}`)}
          onDelete={handleDeleteClick}
          getCategoryName={getCategoryName}
          getSubcategoryName={getSubcategoryName}
        />
      )}

      {/* ============================================ */}
      {/* PAGINATION */}
      {/* ============================================ */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-between gap-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPage} • {meta.total} products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= meta.totalPage || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* DELETE DIALOG */}
      {/* ============================================ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                {selectedProduct.images?.[0] ? (
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-xs text-muted-foreground">
                    SKU: {selectedProduct.sku}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================
// PRODUCT CARD (Grid View)
// ============================================
function ProductCard({
  product,
  onEdit,
  onDelete,
  onFeaturedToggle,
  getCategoryName,
  getSubcategoryName,
}: {
  product: any;
  onEdit: () => void;
  onDelete: () => void;
  onFeaturedToggle: () => void;
  getCategoryName: (p: any) => string;
  getSubcategoryName: (p: any) => string;
}) {
  const discountedPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/60">
      <div className="relative">
        {/* Image */}
        <div className="aspect-square bg-muted overflow-hidden relative">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {!product.isActive && (
              <Badge variant="destructive" className="text-[10px]">
                Inactive
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="text-[10px] bg-yellow-500 hover:bg-yellow-600">
                <Star className="h-2.5 w-2.5 mr-1 fill-current" />
                Featured
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="text-[10px]">
                {Math.round(
                  ((product.price - product.discountPrice) / product.price) *
                    100
                )}
                % OFF
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full shadow-md text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          {/* Category */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-[10px] font-medium">
              {getCategoryName(product)}
            </Badge>
            <Badge variant="outline" className="text-[10px] font-medium bg-primary/5">
              {getSubcategoryName(product)}
            </Badge>
          </div>

          {/* Name */}
          <div>
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              SKU: {product.sku}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-primary">
                ৳{discountedPrice.toLocaleString()}
              </p>
              {hasDiscount && (
                <p className="text-xs text-muted-foreground line-through">
                  ৳{product.price.toLocaleString()}
                </p>
              )}
            </div>
            {product.moq && (
              <Badge variant="secondary" className="text-[10px]">
                MOQ: {product.moq}
              </Badge>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center justify-between text-xs pt-2 border-t">
            <div className="flex items-center gap-1">
              {product.isInStock && product.stock > 10 ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">In Stock ({product.stock})</span>
                </>
              ) : product.stock > 0 ? (
                <>
                  <XCircle className="h-3 w-3 text-yellow-500" />
                  <span className="text-yellow-600">Low Stock ({product.stock})</span>
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 text-red-500" />
                  <span className="text-red-600">Out of Stock</span>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6",
                product.isFeatured
                  ? "text-yellow-500"
                  : "text-muted-foreground/50"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onFeaturedToggle();
              }}
            >
              <Star
                className={cn("h-3.5 w-3.5", product.isFeatured && "fill-current")}
              />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// ============================================
// PRODUCT TABLE (Table View)
// ============================================
function ProductTable({
  products,
  onEdit,
  onDelete,
  getCategoryName,
  getSubcategoryName,
}: {
  products: any[];
  onEdit: (p: any) => void;
  onDelete: (p: any) => void;
  getCategoryName: (p: any) => string;
  getSubcategoryName: (p: any) => string;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Price</TableHead>
              <TableHead className="hidden lg:table-cell">Stock</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate max-w-[200px]">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="text-[10px] w-fit">
                      {getCategoryName(product)}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] w-fit bg-primary/5">
                      {getSubcategoryName(product)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <p className="font-semibold text-sm">
                    ৳{(product.discountPrice || product.price).toLocaleString()}
                  </p>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      product.stock > 10
                        ? "text-green-600"
                        : product.stock > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                    )}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    {product.isActive ? (
                      <Badge
                        className="bg-green-500/10 text-green-600 border-green-500/20"
                        variant="outline"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        className="bg-gray-500/10 text-gray-600"
                        variant="outline"
                      >
                        Inactive
                      </Badge>
                    )}
                    {product.isFeatured && (
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(product)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}