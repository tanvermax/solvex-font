// src/redux/axiosBaseQuery.ts
import { axiosInstance } from "@/lib/axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      body?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, body, params, headers }) => {
    try {
      const token = localStorage.getItem("token");
      const requestData = data || body;

      // 🔥 Check if FormData — don't set Content-Type manually
      const isFormData = requestData instanceof FormData;

      const result = await axiosInstance({
        url: url,
        method,
        data: requestData,
        params,
        headers: {
          // 🔥 FormData হলে Content-Type দেবেন না (browser auto set করবে)
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;