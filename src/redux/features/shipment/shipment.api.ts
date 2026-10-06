// src/redux/features/shipment/shipment.api.ts
import { baseApi } from "@/redux/baseApi";

// ============================================
// 🔥 TYPES
// ============================================

export type ShipmentStatus =
  | "PENDING"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";

export type ShipmentPriority = "STANDARD" | "HIGH" | "URGENT";

export interface ShipmentItem {
  productId?: string;
  productName: string;
  sku?: string;
  quantity: number;
}

export interface ShipmentAddress {
  label?: string;
  address: string;
  city: string;
  zone?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  contactPerson?: string;
}

export interface ShipmentCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface ShipmentPackageInfo {
  packageType: string;
  weight: number;
  weightUnit: "kg" | "lbs";
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "in";
  };
  declaredValue?: number;
  insurance?: boolean;
  insuranceValue?: number;
}

export interface ShipmentStatusEntry {
  status: ShipmentStatus;
  location?: string;
  note?: string;
  updatedAt: string;
  updatedBy?: string;
  updatedByName?: string;
}

export interface Shipment {
  _id: string;
  trackingId: string;

  // 🔥 orderId populated shape (backend populate করে object দেয়)
  orderId:
    | string
    | {
        _id: string;
        orderNumber: string;
        grandTotal?: number;
        items?: any[];
      };
  orderNumber: string;
  userId?:
    | string
    | { _id: string; name: string; email: string; phone?: string };

  customer: ShipmentCustomer;
  shippingAddress: ShipmentAddress;
  items: ShipmentItem[];

  carrierName?: string;
  carrierContact?: string;
  serviceType?: string;
  driverName?: string;
  driverContact?: string;
  vehicleNumber?: string;

  packageInfo: ShipmentPackageInfo;

  currentStatus: ShipmentStatus;
  priority: ShipmentPriority;
  statusHistory: ShipmentStatusEntry[];

  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  dispatchedAt?: string;

  specialInstructions?: string;
  adminNote?: string;

  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

// ============================================
// 🎯 RESPONSE TYPES
// ============================================

export interface ShipmentResponse {
  success: boolean;
  message: string;
  data: Shipment;
}

export interface ShipmentListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Shipment[];
}

export interface ShipmentStats {
  total: number;
  pending: number;
  pickedUp: number;
  inTransit: number;
  outForDelivery: number;
  delivered: number;
  returned: number;
  cancelled: number;
  deliveryRate: number;
}

export interface ShipmentStatsResponse {
  success: boolean;
  message: string;
  data: ShipmentStats;
}

// ============================================
// 📝 REQUEST PAYLOADS
// ============================================

export interface CreateShipmentData {
  orderId: string;
  customer: ShipmentCustomer;
  shippingAddress: ShipmentAddress;
  items?: ShipmentItem[];
  carrierName?: string;
  carrierContact?: string;
  serviceType?: string;
  driverName?: string;
  driverContact?: string;
  vehicleNumber?: string;
  packageInfo: ShipmentPackageInfo;
  priority?: ShipmentPriority;
  estimatedDeliveryDate?: string;
  specialInstructions?: string;
  adminNote?: string;
}

// 🔥 Edit shipment — only allowed fields
export interface UpdateShipmentData {
  carrierName?: string;
  carrierContact?: string;
  serviceType?: string;
  driverName?: string;
  driverContact?: string;
  vehicleNumber?: string;
  priority?: ShipmentPriority;
  estimatedDeliveryDate?: string;
  specialInstructions?: string;
  adminNote?: string;
}

export interface UpdateShipmentStatusData {
  status: ShipmentStatus;
  location?: string;
  note?: string;
}

export interface ShipmentFilters {
  status?: ShipmentStatus;
  priority?: ShipmentPriority;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ============================================
// 🚀 RTK QUERY API
// ============================================

export const shipmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create
    createShipment: builder.mutation<ShipmentResponse, CreateShipmentData>({
      query: (data) => ({
        url: "/shipment/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["SHIPMENT", "ORDER", "DASHBOARD_STATS"],
    }),

    // Get all
    getAllShipments: builder.query<
      ShipmentListResponse,
      ShipmentFilters | void
    >({
      query: (params) => ({
        url: "/shipment/all",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["SHIPMENT"],
    }),

    // Stats
    getShipmentStats: builder.query<ShipmentStatsResponse, void>({
      query: () => ({
        url: "/shipment/stats",
        method: "GET",
      }),
      providesTags: ["SHIPMENT", "DASHBOARD_STATS"],
    }),

    // 🔍 Get by ID (Admin)
    getShipmentById: builder.query<ShipmentResponse, string>({
      query: (id) => ({
        url: `/shipment/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "SHIPMENT", id }],
    }),

    // 🔓 Get by tracking ID (Public)
    getShipmentByTrackingId: builder.query<ShipmentResponse, string>({
      query: (trackingId) => ({
        url: `/shipment/track/${trackingId}`,
        method: "GET",
      }),
      providesTags: (result, error, trackingId) => [
        { type: "SHIPMENT", id: trackingId },
      ],
    }),

    // 🔄 Update Status
    updateShipmentStatus: builder.mutation<
      ShipmentResponse,
      { id: string; data: UpdateShipmentStatusData }
    >({
      query: ({ id, data }) => ({
        url: `/shipment/${id}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SHIPMENT", id },
        "SHIPMENT",
        "ORDER",
        "DASHBOARD_STATS",
      ],
    }),

    // ✏️ Update Shipment (edit)
    updateShipment: builder.mutation<
      ShipmentResponse,
      { id: string; data: UpdateShipmentData }
    >({
      query: ({ id, data }) => ({
        url: `/shipment/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SHIPMENT", id },
        "SHIPMENT",
      ],
    }),

    // Delete
    deleteShipment: builder.mutation<
      { success: boolean; message: string; data: null },
      string
    >({
      query: (id) => ({
        url: `/shipment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SHIPMENT", "ORDER", "DASHBOARD_STATS"],
    }),
  }),
});

export const {
  useCreateShipmentMutation,
  useGetAllShipmentsQuery,
  useGetShipmentStatsQuery,
  useGetShipmentByIdQuery,
  useGetShipmentByTrackingIdQuery,
  useUpdateShipmentStatusMutation,
  useUpdateShipmentMutation,
  useDeleteShipmentMutation,
} = shipmentApi;