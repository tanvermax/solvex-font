// src/redux/features/subcategory/subcategory.api.ts
import { baseApi } from "@/redux/baseApi";

// 🔥 Types
export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  categoryId:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
      };
  description?: string;
  order: number;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubcategoryResponse {
  success: boolean;
  message: string;
  data: Subcategory;
}

export interface SubcategoryListResponse {
  success: boolean;
  message: string;
  data: Subcategory[];
}

export interface CreateSubcategoryData {
  name: string;
  slug?: string;
  categoryId: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export const subcategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 📋 Get all subcategories (with optional filters)
    getAllSubcategories: builder.query<
      SubcategoryListResponse,
      { categoryId?: string; includeInactive?: boolean } | void
    >({
      query: (params) => ({
        url: "/subcategories",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["SUBCATEGORY"],
    }),

    // 🔍 Get subcategories by category
    getSubcategoriesByCategory: builder.query<
      SubcategoryListResponse,
      string
    >({
      query: (categoryId) => ({
        url: `/subcategories/by-category/${categoryId}`,
        method: "GET",
      }),
      providesTags: (result, error, categoryId) => [
        { type: "SUBCATEGORY", id: categoryId },
      ],
    }),

    // 🔍 Get subcategory by ID
    getSubcategoryById: builder.query<SubcategoryResponse, string>({
      query: (id) => ({
        url: `/subcategories/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "SUBCATEGORY", id }],
    }),

    // 📝 Create subcategory
    createSubcategory: builder.mutation<
      SubcategoryResponse,
      CreateSubcategoryData
    >({
      query: (data) => ({
        url: "/subcategories/create",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["SUBCATEGORY", "CATEGORY"],
    }),

    // ✏️ Update subcategory
    updateSubcategory: builder.mutation<
      SubcategoryResponse,
      { id: string; data: Partial<CreateSubcategoryData> }
    >({
      query: ({ id, data }) => ({
        url: `/subcategories/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["SUBCATEGORY", "CATEGORY"],
    }),

    // 🗑️ Delete subcategory
    deleteSubcategory: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/subcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SUBCATEGORY", "CATEGORY"],
    }),
  }),
});

export const {
  useGetAllSubcategoriesQuery,
  useGetSubcategoriesByCategoryQuery,
  useGetSubcategoryByIdQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = subcategoryApi;