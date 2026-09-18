// src/redux/features/reports/reports.api.ts
import { baseApi } from "@/redux/baseApi";

export interface ReportFilters {
  type: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
}

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReport: builder.query({
      query: (filters: ReportFilters) => ({
        url: "/admin/reports",
        method: "GET",
        params: filters,
      }),
      providesTags: ["REPORT"],
    }),
    exportReport: builder.mutation({
      query: ({ format, filters }: { format: string; filters: ReportFilters }) => ({
        url: `/admin/reports/export/${format}`,
        method: "POST",
        data: filters,
        responseHandler: "blob",
      }),
    }),
    getReportTypes: builder.query({
      query: () => ({
        url: "/admin/reports/types",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetReportQuery,
  useExportReportMutation,
  useGetReportTypesQuery,
} = reportsApi;