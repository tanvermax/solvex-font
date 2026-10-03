// src/redux/features/category/category.api.ts
import { baseApi } from "@/redux/baseApi";

// 🔥 Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  subcategoryCount?: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CategoryListResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 📋 Get all categories
    getAllCategories: builder.query<CategoryListResponse, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["CATEGORY"],
    }),

    // 🔍 Get category by ID
    getCategoryById: builder.query<CategoryResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "CATEGORY", id }],
    }),

    // 🔍 Get category by slug (with subcategories)
    getCategoryBySlug: builder.query<CategoryResponse, string>({
      query: (slug) => ({
        url: `/categories/slug/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: "CATEGORY", slug }],
    }),

    // 📝 Create category
    createCategory: builder.mutation<CategoryResponse, CreateCategoryData>({
      query: (data) => ({
        url: "/categories/create",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["CATEGORY"],
    }),

    // ✏️ Update category
    updateCategory: builder.mutation<
      CategoryResponse,
      { id: string; data: Partial<CreateCategoryData> }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["CATEGORY"],
    }),

    // 🗑️ Delete category
    deleteCategory: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CATEGORY"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;