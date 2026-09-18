import { baseApi } from "@/redux/baseApi";
// redux/features/admin/admin.api.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;           // 🔥 number → string (সহজ)
  role: "SUPER_ADMIN" | "ADMIN" | "USER" | "CORPORATE_BUYER" | "AGENT";
  isActive: "ACTIVE" | "INACTIVE" | "BLOCKED";
  isDeleted: boolean;
  isVerified: boolean;
  picture?: string;
  companyName?: string;
  binOrTaxId?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

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

  getAllUsers: builder.query<
      { success: boolean; message: string; data: User[] },
      { search?: string; role?: string; status?: string }
    >({
      query: (params) => ({
        url: "/user/all",
        method: "GET",
        params,
      }),
      providesTags: ["USER"],
    }),

    // 🔍 Get single user
    getUserById: builder.query<
      { success: boolean; message: string; data: User },
      string
    >({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "USER", id }],
    }),

    // ✏️ Update user
    updateUser: builder.mutation<
      { success: boolean; message: string; data: User },
      { id: string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["USER"],
    }),

    // 🔄 Change user role
    changeUserRole: builder.mutation<
      { success: boolean; message: string; data: User },
      { id: string; role: string }
    >({
      query: ({ id, role }) => ({
        url: `/user/${id}/role`,
        method: "PATCH",
        data: { role },
      }),
      invalidatesTags: ["USER"],
    }),

    // 🔄 Change user status
    changeUserStatus: builder.mutation<
      { success: boolean; message: string; data: User },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/user/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["USER"],
    }),

    // 🗑️ Delete user
    deleteUser: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USER"],
    }),
  })
})

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
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useChangeUserRoleMutation,
  useChangeUserStatusMutation,
  useDeleteUserMutation,

} = adminApi;