

import { baseApi } from "@/redux/baseApi";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED";


export type PaymentMethod = "CASH" | "LC" | "CREDIT" | "ONLINE";
export type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID" | "REFUNDED";
export type OrderPriority = "STANDARD" | "HIGH" | "URGENT";

export interface OrderItem {
  productId: string;
  productName: string;
  productSku?: string;
  productImage?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount?: number;
  taxRate?: number;
  total: number;
}

export interface OrderCompanyInfo {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  binOrTaxId?: string;
}

export interface OrderShippingAddress {
  label?: string;
  address: string;
  city: string;
  zone?: string;
  phone?: string;
  contactPerson?: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  changedBy?: string;
  changedByName?: string;
  note?: string;
  timestamp: string;
}

export interface Order {
  _id: string;
  orderNumber: string;

  userId?: string | { _id: string; name: string; email: string };
  rfqId?: string | { _id: string; rfqNumber: string };
  quotationId?: string | { _id: string; quotationNumber: string };

  companyInfo: OrderCompanyInfo;
  shippingAddress: OrderShippingAddress;

  items: OrderItem[];

  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  grandTotal: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  dueAmount: number;
  paymentDueDate?: string;
  payments?: any[];

  orderStatus: OrderStatus;
  priority: OrderPriority;
  statusHistory: OrderStatusHistory[];

  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  deliveryNote?: string;

  shipmentTrackingIds?: string[];

  customerNote?: string;
  adminNote?: string;

  attachments?: any[];

  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

// ============================================
// 🎯 RESPONSE TYPES
// ============================================

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface OrderListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Order[];
}

export interface OrderStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    pending: number;
    processing: number;
    delivered: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
    todayOrders: number;
    completionRate: number;
  };
}

// ============================================
// 📝 REQUEST PAYLOADS
// ============================================

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  priority?: OrderPriority;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateOrderData {
  rfqId?: string;
  quotationId?: string;
  companyInfo: OrderCompanyInfo;
  shippingAddress: OrderShippingAddress;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    discount?: number;
    taxRate?: number;
    total: number;
  }[];
  shippingCost?: number;
  discountAmount?: number;
  paymentMethod?: PaymentMethod;
  priority?: OrderPriority;
  customerNote?: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  note?: string;
  deliveryNote?: string;
  actualDeliveryDate?: string;
}

export interface RecordPaymentData {
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  reference?: string;
  note?: string;
}

// ============================================
// 🚀 RTK QUERY API
// ============================================

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================
    // 👤 BUYER — Create Order
    // ============================================
    createOrder: builder.mutation<OrderResponse, CreateOrderData>({
      query: (data) => ({
        url: "/order/create",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["ORDER", "DASHBOARD_STATS"],
    }),

    // ============================================
    // 👤 BUYER — Get My Orders
    // ============================================
    getMyOrders: builder.query<OrderListResponse, OrderFilters | void>({
      query: (params) => ({
        url: "/order/me",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["ORDER"],
    }),

    // ============================================
    // 🔐 ADMIN — Get All Orders (with filters)
    // ============================================
    getAllOrders: builder.query<OrderListResponse, OrderFilters | void>({
      query: (params) => ({
        url: "/order/all",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["ORDER"],
    }),

    // ============================================
    // 🔐 ADMIN — Order Stats
    // ============================================
    getOrderStats: builder.query<OrderStatsResponse, void>({
      query: () => ({
        url: "/order/stats",
        method: "GET",
      }),
      providesTags: ["ORDER", "DASHBOARD_STATS"],
    }),

    // 🔓 PUBLIC — Track by Order Number
    // ============================================
    getOrderByNumber: builder.query<OrderResponse, string>({
      query: (orderNumber) => ({
        url: `/order/track/${orderNumber}`,
        method: "GET",
      }),
    }),

    // ============================================
    // 🔍 GET SINGLE ORDER BY ID
    // ============================================
    getOrderById: builder.query<OrderResponse, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ORDER", id }],
    }),

    // ============================================
    // 🔐 ADMIN — Update Order Status
    // ============================================
    updateOrderStatus: builder.mutation<
      OrderResponse,
      { id: string; data: UpdateOrderStatusData }>({
      query: ({ id, data }) => ({
        url: `/order/${id}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ORDER", id },
        "ORDER",
        "DASHBOARD_STATS",
      ],
    }),

    // ============================================
    // 🔐 ADMIN — Record Payment
    // ============================================
    recordPayment: builder.mutation<
      OrderResponse,
      { id: string; data: RecordPaymentData }>({
      query: ({ id, data }) => ({
        url: `/order/${id}/payment`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ORDER", id },
        "ORDER",
        "DASHBOARD_STATS",
      ],
    }),

    // ============================================
    // 🔐 ADMIN — Update Order (limited)
    // ============================================
    updateOrder: builder.mutation<
      OrderResponse,
      { id: string; data: Partial<Order> }>({
      query: ({ id, data }) => ({
        url: `/order/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ORDER", id },
        "ORDER",
      ],
    }),

    // ============================================
    // 🔐 ADMIN — Link Shipment
    // ============================================
    linkShipmentToOrder: builder.mutation<
      OrderResponse,
      { id: string; trackingId: string }>({
      query: ({ id, trackingId }) => ({
        url: `/order/${id}/link-shipment`,
        method: "PATCH",
        data: { trackingId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ORDER", id },
        "ORDER",
        "SHIPMENT",
      ],
    }),

    // ============================================
    // ❌ CANCEL ORDER (Buyer or Admin)
    // ============================================
    cancelOrder: builder.mutation<
      OrderResponse,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/order/${id}/cancel`,
        method: "PATCH",
        data: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ORDER", id },
        "ORDER",
        "DASHBOARD_STATS",
      ],
    }),

    // ============================================
    // 🗑️ DELETE ORDER (SUPER_ADMIN only)
    // ============================================
    deleteOrder: builder.mutation<
      { success: boolean; message: string; data: null },string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ORDER", "DASHBOARD_STATS"],
    }),
  }),
});

// ============================================
// 📤 EXPORT HOOKS
// ============================================

export const {
  // Buyer
  useCreateOrderMutation,
  useGetMyOrdersQuery,

  // Admin
  useGetAllOrdersQuery,           // ← এটাই আপনার AdminCreateShipmentPage-এ লাগবে
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
  useRecordPaymentMutation,
  useUpdateOrderMutation,
  useLinkShipmentToOrderMutation,
  useDeleteOrderMutation,

  // Both
  useGetOrderByIdQuery,
  useGetOrderByNumberQuery,
  useCancelOrderMutation,
} = orderApi;