// auth.api.ts
import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOtp, IVerifyOtp } from "@/types";
import { setUser, logout } from "./auth.slice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
        withCredentials: true,
      }),
      async onQueryStarted( { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const userData = data?.data?.user || data?.user;
          const token = data?.data?.token || data?.data?.accessToken || data?.token;
          
          if (userData && token) {
            dispatch(setUser({ user: userData, token }));
          }
        } catch (error) {
          console.error("Login state update error:", error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        withCredentials: true,
      }),
      // 🔥 Important: Clear cache and invalidate all tags
      invalidatesTags: ["USER"],
      async onQueryStarted( { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // 🔥 Dispatch logout action to clear Redux state
          dispatch(logout());
          // 🔥 Reset all API state
          dispatch(baseApi.util.resetApiState());
          
          // 🔥 Clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('persist:root'); // if using redux-persist
          
          // 🔥 Clear cookies
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
          });
        } catch (error) {
          console.error("Logout error:", error);
          // Even if API fails, clear local state
          dispatch(logout());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
    sendOtp: builder.mutation<IResponse<null>, ISendOtp>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),
    verifyOtp: builder.mutation<IResponse<null>, IVerifyOtp>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
        withCredentials: true,
      }),
      providesTags: ["USER"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetMeQuery,
} = authApi;