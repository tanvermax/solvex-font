// src/redux/features/user/user.api.ts (বা auth.api.ts এ যোগ করতে পারেন)

import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Logged-in User Profile
    getMe: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    // 2. Track Order / Shipment (Public/User)
    trackShipment: builder.query({
      query: (trackingId: string) => ({
        url: `/tracking/track/${trackingId}`,
        method: "GET",
      }),
    }),

    // 3. Request Quotation / RFQ
    createQuotation: builder.mutation({
      query: (quotationData) => ({
        url: "/quotations/request",
        method: "POST",
        data: quotationData,
      }),
      invalidatesTags: ["QUOTATION"],
    }),

    // 4. Update Profile Info
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/update-me",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useTrackShipmentQuery,
  useLazyTrackShipmentQuery,
  useCreateQuotationMutation,
  useUpdateProfileMutation,
} = userApi;