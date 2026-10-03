// src/components/layout/AdminLayoute/Subcategory/SubcategoryFormPage.tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, X, ArrowLeft } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

import {
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useGetSubcategoryByIdQuery,
} from "@/redux/features/subcategory/subcategory.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";

// 🔥 Zod Schema
const subcategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().optional(),
  categoryId: z.string().min(1, "Parent category is required"),
  description: z.string().optional(),
  order: z.number().min(0).optional(),
  isActive: z.boolean(),
});

type SubcategoryFormValues = z.infer<typeof subcategorySchema>;

export default function SubcategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // 🔥 APIs
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: subcategoryData, isLoading: isLoadingSubcategory } =
    useGetSubcategoryByIdQuery(id!, { skip: !id });
  const [createSubcategory, { isLoading: isCreating }] =
    useCreateSubcategoryMutation();
  const [updateSubcategory, { isLoading: isUpdating }] =
    useUpdateSubcategoryMutation();

  const categories = categoriesData?.data || [];

  const form = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      description: "",
      order: 0,
      isActive: true,
    },
  });

  // 🔥 Load data in edit mode
  useEffect(() => {
    if (subcategoryData?.data) {
      const sub = subcategoryData.data;
      const categoryId =
        typeof sub.categoryId === "object" ? sub.categoryId._id : sub.categoryId;

      form.reset({
        name: sub.name,
        slug: sub.slug,
        categoryId,
        description: sub.description || "",
        order: sub.order,
        isActive: sub.isActive,
      });
    }
  }, [subcategoryData, form]);

  // 🔥 Submit
  const onSubmit = async (data: SubcategoryFormValues) => {
    try {
      if (isEditMode && id) {
        await updateSubcategory({ id, data }).unwrap();
        toast.success("Subcategory updated successfully");
      } else {
        await createSubcategory(data).unwrap();
        toast.success("Subcategory created successfully");
      }
      navigate("/admin/subcategories");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save subcategory");
    }
  };

  if (isEditMode && isLoadingSubcategory) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/subcategories")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Subcategory" : "Add New Subcategory"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Update subcategory details"
              : "Create a new product subcategory"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 🔥 Dynamic Parent Category Dropdown */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
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
                    <FormDescription>
                      Select the main category this belongs to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Writing Instruments" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="writing-instruments" {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave empty to auto-generate from name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Pens, pencils, markers..."
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Lower number shows first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Show this subcategory on the website
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
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/subcategories")}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-primary hover:bg-primary/90"
            >
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update Subcategory" : "Create Subcategory"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}