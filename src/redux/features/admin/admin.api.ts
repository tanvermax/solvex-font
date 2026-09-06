import { baseApi } from "@/redux/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // 1. QUOTATION / RFQ MANAGEMENT (ADMIN)
    // ==========================================
    
    // সকল RFQ / Quotation রিকোয়েস্ট দেখার জন্য
    getAllQuotations: builder.query({
      query: (params) => ({
        url: "/admin/quotations",
        method: "GET",
        params,
      }),
      providesTags: ["QUOTATION"],
    }),

    // কাস্টমারকে প্রাইস কোটেশন পাঠানো বা স্ট্যাটাস আপডেট করার জন্য
    updateQuotationStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/quotations/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["QUOTATION"],
    }),

    // ==========================================
    // 2. FLEET & SHIPMENT TRACKING (ADMIN)
    // ==========================================

    // সকল শিপমেন্ট ট্র্যাকিং লিস্ট দেখার জন্য
    getAllShipments: builder.query({
      query: (params) => ({
        url: "/admin/shipments",
        method: "GET",
        params,
      }),
      providesTags: ["SHIPMENT"],
    }),

    // নতুন ট্র্যাকিং আইডি ও শিপমেন্ট ক্রিয়েট করার জন্য
    createShipmentTracking: builder.mutation({
      query: (shipmentData) => ({
        url: "/admin/shipments/create",
        method: "POST",
        data: shipmentData,
      }),
      invalidatesTags: ["SHIPMENT"],
    }),

    // শিপমেন্টের বর্তমান লোকেশন বা স্ট্যাটাস আপডেট করার জন্য (e.g., In-Transit, Out for Delivery)
    updateShipmentStatus: builder.mutation({
      query: ({ trackingId, ...data }) => ({
        url: `/admin/shipments/${trackingId}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["SHIPMENT"],
    }),

    // ==========================================
    // 3. ADMIN ANALYTICS & OVERVIEW
    // ==========================================

    // ড্যাশবোর্ডের ওভারভিউ ডাটার জন্য (Total Revenue, Total RFQ, Active Shipments)
    getAdminDashboardStats: builder.query({
      query: () => ({
        url: "/admin/analytics/overview",
        method: "GET",
      }),
      providesTags: ["USER", "QUOTATION", "SHIPMENT"],
    }),
  }),
});

export const {
  // Quotation Hooks
  useGetAllQuotationsQuery,
  useUpdateQuotationStatusMutation,
  
  // Tracking & Shipment Hooks
  useGetAllShipmentsQuery,
  useCreateShipmentTrackingMutation,
  useUpdateShipmentStatusMutation,
  
  // Analytics Hook
  useGetAdminDashboardStatsQuery,
} = adminApi;