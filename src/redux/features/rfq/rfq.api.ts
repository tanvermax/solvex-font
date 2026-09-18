// redux/features/rfq/rfq.api.ts
import { baseApi } from "@/redux/baseApi";

export interface RFQItem {
  productTitle: string;
  quantity: string;
  unit?: string;
  specifications?: string;
  preferredBrand?: string;
  estimatedPrice?: number;
}

export interface RFQAttachment {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export interface RFQFormData {
  fullName: string;
  companyName: string;
  workEmail: string;
  phone: string;
  industry: string;
  productDetails: string;
  quantity: string;
  targetPrice?: string;
  paymentTerms: string;
  deliveryTimeline: string;
  priority?: string;
  items?: RFQItem[];
  attachments?: File[];
}

export interface RFQ {
  _id: string;
  rfqNumber: string;
  fullName: string;
  companyName: string;
  workEmail: string;
  phone: string;
  industry: string;
  productDetails: string;
  quantity: string;
 
  targetPrice?: string;
  paymentTerms: string;
  deliveryTimeline: string;
  priority: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "QUOTED" | "CONVERTED_TO_ORDER";
  adminNote?: string;
  quotedPrice?: number;
  quotationId?: {
    _id: string;
    quotationNumber: string;
    total: number;
    grandTotal: number;
    status: string;
  };
  orderId?: string;
  attachments?: RFQAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface RFQStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  quoted: number;
  converted: number;
  totalValue: number;
  conversionRate: number;
}

export interface RFQResponse {
  success: boolean;
  message: string;
  data: any;
}
export interface RFQListResponse {
  success: boolean;
  message: string;
  data: RFQ[];  // ✅ data property সহ
}

export const rfqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 📝 Create RFQ (Public)
    createRFQ: builder.mutation<RFQResponse, RFQFormData>({
      query: (data) => ({
        url: "/rfq/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["RFQ"],
    }),

    // 📋 Get all RFQs (Admin)
    getAllRFQs: builder.query<
      RFQListResponse,  // 🔥 পরিবর্তন: RFQ[] → RFQListResponse
      { status?: string; priority?: string; industry?: string; search?: string }
    >({
      query: (params) => ({
        url: "/rfq/all",
        method: "GET",
        params,
      }),
      providesTags: ["RFQ"],
      // 🔥 Transform Response যোগ করুন (ঐচ্ছিক)
      transformResponse: (response: any) => {
        // console.log("📊 getAllRFQs Response:", response);
        return response; // { success, message, data: [...] }
      },
    }),

    // 👤 Get user's RFQs (User)
    getUserRFQs: builder.query<RFQ[], string>({
      query: (email) => ({
        url: `/rfq/user?email=${encodeURIComponent(email)}`,
        method: "GET",
      }),
      providesTags: ["RFQ"],
      transformResponse: (response: any) => {
        // console.log("📊 getAllRFQs Response:", response);
        return response;
      },

    }),

    // 📊 Get RFQ stats (Admin Dashboard)
    getRFQStats: builder.query<RFQStats, void>({
      query: () => ({
        url: "/rfq/stats",
        method: "GET",
      }),
      providesTags: ["RFQ"],
    }),

    // 🔍 Get single RFQ by ID
    getRFQById: builder.query<RFQ, string>({
      query: (id) => ({
        url: `/rfq/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "RFQ", id }],
    }),

    // ✅ Update RFQ status (Admin)
   // redux/features/rfq/rfq.api.ts
// updateProfile: builder.mutation({
//       query: (data) => ({
//         url: "/user/update-me",
//         method: "PATCH",
//         data,
//       }),
//       invalidatesTags: ["USER"],
//     }),
updateRFQStatus: builder.mutation({
      query: (data) => {
        const { id, ...payload } = data;
        console.log("🔥 API Payload:", payload);
        console.log("🔥 API URL:", `/rfq/${id}/status`);
        
        return {
          url: `/rfq/${id}/status`,
          method: "PATCH",
          data: payload,
        };
      },
      // 🔥 FIX: সঠিক syntax
      invalidatesTags: ["RFQ"],  // ← সবচেয়ে সহজ, এটাই ব্যবহার করুন
    }),

    // 🔗 Link Quotation to RFQ
    linkQuotationToRFQ: builder.mutation<
      RFQResponse,
      { id: string; quotationId: string; quotedPrice: number }
    >({
      query: ({ id, ...data }) => ({
        url: `/rfq/${id}/link-quotation`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "RFQ", id }, "RFQ"],
    }),

    // 🗑️ Delete RFQ (Admin)
    deleteRFQ: builder.mutation<RFQResponse, string>({
      query: (id) => ({
        url: `/rfq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RFQ"],
    }),


    getRFQAnalytics: builder.query<
      { success: boolean; message: string; data: any },
      { dateRange?: string }
    >({
      query: (params) => ({
        url: "/rfq/analytics",
        method: "GET",
        params,
      }),
      providesTags: ["RFQ"],
    }),
  }),
  
   
});

export const {
  useGetRFQAnalyticsQuery,
  useCreateRFQMutation,
  useUpdateRFQStatusMutation,
  useLinkQuotationToRFQMutation,
  useDeleteRFQMutation,
  useGetAllRFQsQuery,
  useGetUserRFQsQuery,
  useGetRFQStatsQuery,
  useGetRFQByIdQuery,
} = rfqApi;