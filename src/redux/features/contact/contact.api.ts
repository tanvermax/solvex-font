// redux/features/contact/contact.api.ts
import { baseApi } from "@/redux/baseApi";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject?: string;
  message: string;
  priority?: "standard" | "urgent" | "critical";
}

export interface ContactReply {
  _id: string;
  message: string;
  repliedByName: string;
  repliedAt: string;
}

export interface Contact {
  _id: string;
  ticketNumber: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  priority: "standard" | "urgent" | "critical";
  status: "NEW" | "IN_PROGRESS" | "REPLIED" | "RESOLVED" | "CLOSED";
  adminNote?: string;
  replies?: ContactReply[];
  createdAt: string;
  updatedAt: string;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 📝 Submit Contact (Public)
    createContact: builder.mutation<
      { success: boolean; message: string; data: Contact },
      ContactFormData
    >({
      query: (data) => ({
        url: "/contact/create",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["CONTACT"],
    }),

    // 📋 Get all contacts (Admin)
    getAllContacts: builder.query<
      { success: boolean; message: string; data: Contact[] },
      { status?: string; priority?: string; search?: string }
    >({
      query: (params) => ({
        url: "/contact/all",
        method: "GET",
        params,
      }),
      providesTags: ["CONTACT"],
    }),

    // 📊 Get stats
    getContactStats: builder.query<
      { success: boolean; message: string; data: any },
      void
    >({
      query: () => ({
        url: "/contact/stats",
        method: "GET",
      }),
      providesTags: ["CONTACT"],
    }),

    // 🔍 Get single contact
    getContactById: builder.query<
      { success: boolean; message: string; data: Contact },
      string
    >({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "CONTACT", id }],
    }),

    // 🔄 Update status
    updateContactStatus: builder.mutation({
      query: ({ id, status, adminNote }) => ({
        url: `/contact/${id}/status`,
        method: "PATCH",
        data: { status, adminNote },
      }),
      invalidatesTags: ["CONTACT"],
    }),

    // 💬 Reply
    replyToContact: builder.mutation({
      query: ({ id, message }) => ({
        url: `/contact/${id}/reply`,
        method: "POST",
        data: { message },
      }),
      invalidatesTags: ["CONTACT"],
    }),

    // 🗑️ Delete
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CONTACT"],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetAllContactsQuery,
  useGetContactStatsQuery,
  useGetContactByIdQuery,
  useUpdateContactStatusMutation,
  useReplyToContactMutation,
  useDeleteContactMutation,
} = contactApi;