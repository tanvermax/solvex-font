// src/redux/features/shipments/shipments.api.ts
import { baseApi } from "@/redux/baseApi";

export interface CreateShipmentData {
  orderId: string;
  carrier: string;
  serviceType: string;
  weight: number;
  weightUnit: string;
  packageType: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  estimatedDelivery: string;
  insurance: boolean;
  insuranceValue?: number;
  specialInstructions?: string;
  notes?: string;
}

export const shipmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrdersForShipment: builder.query({
      query: (filters) => ({
        url: "/admin/orders/available-for-shipment",
        method: "GET",
        params: filters,
      }),
      providesTags: ["ORDER"],
    }),
    getCarriers: builder.query({
      query: () => ({
        url: "/admin/carriers",
        method: "GET",
      }),
      providesTags: ["CARRIER"],
    }),
    generateTrackingId: builder.mutation({
      query: (orderId: string) => ({
        url: "/admin/shipments/generate-tracking",
        method: "POST",
        data: { orderId },
      }),
    }),
    createShipment: builder.mutation({
      query: (data: CreateShipmentData) => ({
        url: "/admin/shipments",
        method: "POST",
        data,
      }),
      invalidatesTags: ["SHIPMENT", "DASHBOARD_STATS"],
    }),
  }),
});

export const {
  useGetOrdersForShipmentQuery,
  useGetCarriersQuery,
  useGenerateTrackingIdMutation,
  useCreateShipmentMutation,
} = shipmentsApi;