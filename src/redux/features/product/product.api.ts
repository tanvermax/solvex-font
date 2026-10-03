// src/redux/features/product/product.api.ts
import { baseApi } from "@/redux/baseApi";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  categoryId:
    | string
    | { _id: string; name: string; slug: string };
  subcategoryId:
    | string
    | { _id: string; name: string; slug: string };
  price: number;
  discountPrice?: number;
  unit?: string;
  moq?: number;
  taxRate?: number;              // 🔥 যোগ করুন
  isNegotiable?: boolean;        // 🔥 যোগ করুন
  stock: number;
  isInStock: boolean;
  leadTime?: number;             // 🔥 যোগ করুন
  isFeatured: boolean;
  images: string[];
  videoUrl?: string;             // 🔥 যোগ করুন
  specifications?: { key: string; value: string }[];
  tags?: string[];
  weight?: number;               // 🔥 যোগ করুন
  dimensions?: {                 // 🔥 যোগ করুন
    length: number;
    width: number;
    height: number;
  };
  unitsPerCarton?: number;       // 🔥 যোগ করুন
  brand?: string;
  origin?: string;
  sampleAvailable?: boolean;     // 🔥 যোগ করুন
  customizationAvailable?: boolean; // 🔥 যোগ করুন
  warranty?: string;             // 🔥 যোগ করুন
  availableForRFQ?: boolean;     // 🔥 যোগ করুন
  metaTitle?: string;            // 🔥 যোগ করুন
  metaDescription?: string;      // 🔥 যোগ করুন
  isActive: boolean;
  isDeleted: boolean;
  views?: number;                // 🔥 যোগ করুন
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Product[];
}

export interface CreateProductData {
  name: string;
  slug?: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  categoryId: string;
  subcategoryId: string;
  price: number;
  discountPrice?: number;
  unit?: string;
  moq?: number;
  stock?: number;
  isInStock?: boolean;
  isFeatured?: boolean;
  images?: string[];
  specifications?: { key: string; value: string }[];
  tags?: string[];
  brand?: string;
  origin?: string;
  isActive?: boolean;
}

export interface ProductFilters {
  searchTerm?: string;
  categoryId?: string;
  subcategoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeInactive?: boolean;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 📋 Get all products (with filters)
    getAllProducts: builder.query<ProductListResponse, ProductFilters | void>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["PRODUCT"],
    }),

    // 🔍 Get product by ID or slug
    getProductByIdentifier: builder.query<ProductResponse, string>({
      query: (identifier) => ({
        url: `/products/${identifier}`,
        method: "GET",
      }),
      providesTags: (result, error, identifier) => [
        { type: "PRODUCT", id: identifier },
      ],
    }),

    // 📝 Create product
    createProduct: builder.mutation<ProductResponse, CreateProductData>({
      query: (formData) => ({
        url: "/products/create",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["PRODUCT", "CATEGORY", "SUBCATEGORY"],
    }),

    // ✏️ Update product
    updateProduct: builder.mutation<
      ProductResponse,
      { id: string; data: Partial<CreateProductData> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["PRODUCT", "CATEGORY", "SUBCATEGORY"],
    }),

    // 🗑️ Delete product
    deleteProduct: builder.mutation<
      { success: boolean; message: string; data: Product },
      string
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCT", "CATEGORY", "SUBCATEGORY"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdentifierQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;