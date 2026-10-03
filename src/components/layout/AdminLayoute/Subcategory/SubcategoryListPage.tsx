// src/components/layout/AdminLayoute/Subcategory/SubcategoryListPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  RefreshCw,
  Search,
  FolderTree,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import {
  useGetAllSubcategoriesQuery,
  useDeleteSubcategoryMutation,
  Subcategory,
} from "@/redux/features/subcategory/subcategory.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";

export default function SubcategoryListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 🔥 Get categories for filter
  const { data: categoriesData } = useGetAllCategoriesQuery();

  // 🔥 Get subcategories with filter
  const { data, isLoading, refetch } = useGetAllSubcategoriesQuery(
    categoryFilter !== "ALL" ? { categoryId: categoryFilter } : undefined
  );
  const [deleteSubcategory, { isLoading: isDeleting }] =
    useDeleteSubcategoryMutation();

  const subcategories = data?.data || [];
  const categories = categoriesData?.data || [];

  const filteredSubcategories = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubcategory) return;
    try {
      await deleteSubcategory(selectedSubcategory._id).unwrap();
      toast.success("Subcategory deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedSubcategory(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete subcategory");
    }
  };

  const getCategoryName = (sub: Subcategory) => {
    if (typeof sub.categoryId === "object") {
      return sub.categoryId.name;
    }
    const cat = categories.find((c) => c._id === sub.categoryId);
    return cat?.name || "Unknown";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading subcategories...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-background to-background/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subcategories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage product subcategories ({subcategories.length} total)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate("/admin/subcategories/add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subcategory
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by category" />
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
      </div>

      {/* Table */}
      {filteredSubcategories.length === 0 ? (
        <div className="border rounded-xl bg-card shadow-sm py-12">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <FolderTree className="h-12 w-12 text-muted-foreground/30" />
            <p>No subcategories found</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/subcategories/add")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Subcategory
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Subcategory</TableHead>
                <TableHead className="font-semibold">Parent Category</TableHead>
                <TableHead className="font-semibold text-center hidden md:table-cell">
                  Products
                </TableHead>
                <TableHead className="font-semibold text-center">Order</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubcategories.map((subcategory) => (
                <TableRow key={subcategory._id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <p className="font-medium">{subcategory.name}</p>
                      <code className="text-xs text-muted-foreground">
                        {subcategory.slug}
                      </code>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <FolderTree className="h-3 w-3" />
                      {getCategoryName(subcategory)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center hidden md:table-cell">
                    <Badge variant="outline">
                      {subcategory.productCount || 0}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center font-mono">
                    {subcategory.order}
                  </TableCell>

                  <TableCell>
                    {subcategory.isActive ? (
                      <Badge
                        className="bg-green-500/10 text-green-600 border-green-500/20"
                        variant="outline"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-500/10 text-gray-600" variant="outline">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          navigate(`/admin/subcategories/edit/${subcategory._id}`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(subcategory)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subcategory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subcategory? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedSubcategory && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-medium">{selectedSubcategory.name}</p>
              <p className="text-xs text-muted-foreground">
                Parent: {getCategoryName(selectedSubcategory)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
                "Delete Subcategory"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}