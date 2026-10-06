// src/redux/features/reports/reports.api.ts
import { baseApi } from "@/redux/baseApi";

export interface ReportFilters {
  type?: "sales" | "orders" | "products" | "users" | "shipments";
  dateRange?:
    | "today"
    | "yesterday"
    | "last7days"
    | "last30days"
    | "last90days"
    | "lastyear";
}

export interface ReportResponse {
  success: boolean;
  message: string;
  data: {
    summary: {
      totalRevenue: number;
      totalOrders: number;
      totalUsers: number;
      totalShipments: number;
      averageOrderValue: number;
    };
    charts: {
      revenueTrend: { date: string; revenue: number; orders: number }[];
      orderStatus: { name: string; value: number }[];
      shipmentStatus: { name: string; value: number }[];
      topProducts: { name: string; sales: number; revenue: number }[];
      userGrowth: { year: number; month: number; users: number }[];
      categoryDistribution: { name: string; value: number }[];
    };
    topCustomers: {
      name: string;
      contactPerson: string;
      email: string;
      phone: string;
      totalSpent: number;
      orders: number;
    }[];
    recentOrders: {
      _id: string;
      orderNumber: string;
      companyInfo: { companyName: string };
      grandTotal: number;
      orderStatus: string;
      createdAt: string;
    }[];
  };
}

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReport: builder.query<ReportResponse, ReportFilters | void>({
      query: (params) => ({
        url: "/reports",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["REPORT"],
    }),
  }),
});

export const { useGetReportQuery } = reportsApi;