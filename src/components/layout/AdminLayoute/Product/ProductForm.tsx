// src/components/admin/Product/ProductForm.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Save,
  X,
  Info,
  Package,
  ImageIcon,
  DollarSign,
  Truck,
  Tag,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// 🔥 API Hooks
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdentifierQuery,
} from "@/redux/features/product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetSubcategoriesByCategoryQuery } from "@/redux/features/subcategory/subcategory.api";

// 🔥 Components
import SpecificationInput from "./SpecificationInput";
import TagsInput from "./TagsInput";
import MultipleImageUploader from "./MultipleImageUploader";

// 🔥 Zod Schema
const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().min(1, "Subcategory is required"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().min(0).optional(),
  unit: z.string().default("piece"),
  moq: z.number().min(1, "MOQ must be at least 1"),
  taxRate: z.number().min(0).max(100).optional(),
  isNegotiable: z.boolean().default(false),
  stock: z.number().min(0, "Stock must be positive"),
  isInStock: z.boolean().default(true),
  leadTime: z.number().min(1).optional(),
  specifications: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional(),
  tags: z.array(z.string()).optional(),
  weight: z.number().min(0).optional(),
  unitsPerCarton: z.number().min(1).optional(),
  brand: z.string().optional(),
  origin: z.string().optional(),
  sampleAvailable: z.boolean().default(false),
  customizationAvailable: z.boolean().default(false),
  warranty: z.string().optional(),
  availableForRFQ: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  productId?: string;
  mode: "add" | "edit";
}

export default function ProductForm({ productId, mode }: ProductFormProps) {
  const navigate = useNavigate();
  const isEditMode = mode === "edit";

  // 🔥 State for Images (File[] — not in form because we'll upload separately)
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // 🔥 API
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: productData, isLoading: isLoadingProduct } =
    useGetProductByIdentifierQuery(productId!, { skip: !productId });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const categories = categoriesData?.data || [];
  const isSubmitting = isCreating || isUpdating;

  // 🔥 Form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      sku: "",
      shortDescription: "",
      description: "",
      categoryId: "",
      subcategoryId: "",
      price: 0,
      discountPrice: undefined,
      unit: "piece",
      moq: 1,
      taxRate: 0,
      isNegotiable: false,
      stock: 0,
      isInStock: true,
      leadTime: 7,
      specifications: [],
      tags: [],
      weight: 0,
      unitsPerCarton: 1,
      brand: "",
      origin: "",
      sampleAvailable: false,
      customizationAvailable: false,
      warranty: "",
      availableForRFQ: true,
      metaTitle: "",
      metaDescription: "",
      isActive: true,
      isFeatured: false,
    },
  });

  // 🔥 Watch category for subcategory dropdown
  const selectedCategoryId = form.watch("categoryId");

  const { data: subcategoriesData, isFetching: isLoadingSubcategories } =
    useGetSubcategoriesByCategoryQuery(selectedCategoryId, {
      skip: !selectedCategoryId,
    });

  const subcategories = subcategoriesData?.data || [];

// 🔥 Load product in Edit Mode
useEffect(() => {
  if (isEditMode && productData?.data) {
    const p = productData.data;

    const categoryId =
      typeof p.categoryId === "object" ? p.categoryId._id : p.categoryId;
    const subcategoryId =
      typeof p.subcategoryId === "object"
        ? p.subcategoryId._id
        : p.subcategoryId;

    form.reset({
      name: p.name || "",
      sku: p.sku || "",
      shortDescription: p.shortDescription || "",
      description: p.description || "",
      categoryId: categoryId || "",
      subcategoryId: subcategoryId || "",
      price: p.price ?? 0,
      discountPrice: p.discountPrice ?? undefined,
      unit: p.unit || "piece",
      moq: p.moq ?? 1,
      taxRate: p.taxRate ?? 0 ,
      isNegotiable: p.isNegotiable ?? false,
      stock: p.stock ,
      isInStock: p.isInStock ?? true,
      leadTime: p.leadTime ?? 7,
      specifications: (p.specifications as { key: string; value: string }[]) || [],
      tags: p.tags || [],
      weight: p.weight ?? 0,
      unitsPerCarton: p.unitsPerCarton ?? 1,
      brand: p.brand || "",
      origin: p.origin || "",
      sampleAvailable: p.sampleAvailable ?? false,
      customizationAvailable: p.customizationAvailable ?? false,
      warranty: p.warranty || "",
      availableForRFQ: p.availableForRFQ ?? true,
      metaTitle: p.metaTitle || "",
      metaDescription: p.metaDescription || "",
      isActive: p.isActive ?? true,
      isFeatured: p.isFeatured ?? false,
    });

    setExistingImages(p.images || []);
  }
}, [isEditMode, productData, form]);



  // 🔥 Reset subcategory when category changes
  useEffect(() => {
    // Only reset if user changed (not on initial load)
    const currentSubcategory = form.getValues("subcategoryId");
    if (currentSubcategory && subcategories.length > 0) {
      const exists = subcategories.some((s) => s._id === currentSubcategory);
      if (!exists) {
        form.setValue("subcategoryId", "");
      }
    }
  }, [selectedCategoryId, subcategories, form]);

// ProductForm.tsx — onSubmit
const onSubmit = async (data: ProductFormValues) => {
  try {
    // 🔥 Validation
    if (!isEditMode && images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    const formData = new FormData();

    // 🔥 Clean payload
    const payload = {
      ...data,
      discountPrice: data.discountPrice ?? undefined,
      leadTime: data.leadTime ?? undefined,
      weight: data.weight ?? undefined,
      unitsPerCarton: data.unitsPerCarton ?? undefined,
      specifications: (data.specifications || []).filter(
        (s) => s.key && s.value
      ),
      tags: data.tags || [],
    };

    formData.append("data", JSON.stringify(payload));

    // 🔥 New images
    images.forEach((file) => {
      formData.append("files", file);
    });

    // 🔥 🔥 KEY FIX: Edit mode এ ALWAYS existingImages append করুন
    if (isEditMode) {
      console.log("📤 Sending existingImages:", existingImages);
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    if (isEditMode && productId) {
      await updateProduct({ id: productId, data: formData }).unwrap();
      toast.success("Product updated successfully");
    } else {
      await createProduct(formData).unwrap();
      toast.success("Product created successfully");
    }

    navigate("/admin/products");
  } catch (error: any) {
    console.error("Error:", error);
    toast.error(error?.data?.message || "Failed to save product");
  }
};


  // 🔥 Loading (Edit Mode)
  if (isEditMode && isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditMode
              ? "Update product information"
              : "Create a new product for your B2B catalog"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/products")}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ============================================ */}
          {/* SECTION 1: BASIC INFORMATION */}
          {/* ============================================ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Product name, SKU and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Executive Metal Pen"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. EMP-2024-001" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique product code
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief one-line description for listings"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed product description..."
                        className="h-28"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* SECTION 2: CATEGORIES */}
          {/* ============================================ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="h-4 w-4 text-primary" />
                Categories
              </CardTitle>
              <CardDescription>
                Select main category and subcategory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("subcategoryId", "");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.length === 0 ? (
                            <div className="p-3 text-sm text-center text-muted-foreground">
                              No categories available
                            </div>
                          ) : (
                            categories.map((cat) => (
                              <SelectItem key={cat._id} value={cat._id}>
                                {cat.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subcategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedCategoryId || isLoadingSubcategories}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !selectedCategoryId
                                  ? "Select category first"
                                  : isLoadingSubcategories
                                  ? "Loading..."
                                  : "Select subcategory"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategories.length === 0 ? (
                            <div className="p-3 text-sm text-center text-muted-foreground">
                              No subcategories available
                            </div>
                          ) : (
                            subcategories.map((sub) => (
                              <SelectItem key={sub._id} value={sub._id}>
                                {sub.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* SECTION 3: PRICING */}
          {/* ============================================ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4 text-primary" />
                Pricing
              </CardTitle>
              <CardDescription>
                Price, MOQ and tax information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Price (৳) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Price (৳)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Optional"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="piece">Piece</SelectItem>
                          <SelectItem value="kg">Kilogram</SelectItem>
                          <SelectItem value="box">Box</SelectItem>
                          <SelectItem value="dozen">Dozen</SelectItem>
                          <SelectItem value="set">Set</SelectItem>
                          <SelectItem value="pack">Pack</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moq"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        MOQ * <span className="text-xs text-muted-foreground">(Minimum Order Qty)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isNegotiable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel className="text-sm">Price Negotiable</FormLabel>
                        <FormDescription className="text-xs">
                          Bulk pricing available on request
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* SECTION 4: STOCK */}
          {/* ============================================ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4 text-primary" />
                Stock & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leadTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Time (Days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="7"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseInt(e.target.value) : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Delivery time after order
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isInStock"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel className="text-sm">In Stock</FormLabel>
                        <FormDescription className="text-xs">
                          Available for order
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* SECTION 5: MEDIA */}
          {/* ============================================ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ImageIcon className="h-4 w-4 text-primary" />
                Product Images
              </CardTitle>
              <CardDescription>
                Upload up to 5 images. First image will be the main thumbnail.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultipleImageUploader
                value={images}
                onChange={setImages}
                maxImages={5}
                maxSizeMB={5}
              />

              {/* Existing Images (Edit Mode) */}
              {isEditMode && existingImages.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Existing Images:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {existingImages.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border bg-muted group"
                      >
                        <img
                          src={url}
                          alt={`Existing ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() =>
                            setExistingImages(
                              existingImages.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* SECTION 6: SPECIFICATIONS */}
          {/* ============================================ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="h-4 w-4 text-primary" />
                Specifications
              </CardTitle>
              <CardDescription>
                Product specifications (e.g., Material, Size, Weight)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="specifications"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SpecificationInput
                        value={field.value || []}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* SECTION 7: TAGS */}
          {/* ============================================ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="h-4 w-4 text-primary" />
                Tags
              </CardTitle>
              <CardDescription>
                Searchable keywords for your product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TagsInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="e.g. corporate, premium, gift"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* SECTION 8: SHIPPING */}
          {/* ============================================ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Truck className="h-4 w-4 text-primary" />
                Shipping & Packaging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.1"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unitsPerCarton"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Units per Carton</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseInt(e.target.value) : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* SECTION 9: B2B SPECIFIC */}
          {/* ============================================ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                B2B Options
              </CardTitle>
              <CardDescription>
                Corporate features and brand information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. SolveX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country of Origin</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bangladesh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 1 Year Manufacturer Warranty"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="sampleAvailable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <FormLabel className="text-sm">Sample Available</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customizationAvailable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <FormLabel className="text-sm">Customization</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableForRFQ"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <FormLabel className="text-sm">Available for RFQ</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* SECTION 10: STATUS */}
          {/* ============================================ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Show this product on the website
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel className="text-base">Featured</FormLabel>
                        <FormDescription>
                          Show in featured section on homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* ACTIONS */}
          {/* ============================================ */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background/95 backdrop-blur py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/products")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update Product" : "Create Product"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}