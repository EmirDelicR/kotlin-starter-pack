import { ITEMS_PER_PAGE } from "@/constants";
import baseApi from "@/store/services/baseApiSetup";

export interface ContactFormMessage {
  email: string;
  message: string;
  fullName: string;
}

export interface Message {
  id: string;
  sender: string;
  message: string;
  email: string;
  unread: boolean;
  createdAt: string;
  updateAt: string;
}

interface ApiPaginatedMessageResponse {
  data: {
    messages: Message[];
    numberOfPages: number;
  };
  message: string;
  status: number;
}

interface ApiMessageResponse {
  data: Message;
  message: string;
  status: number;
}

const baseApiWithTag = baseApi.enhanceEndpoints({ addTagTypes: ["Message"] });

export const contactSlice = baseApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data: ContactFormMessage) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Message"],
    }),

    getPaginatedMessages: builder.query<
      { messages: Message[]; numberOfPages: number },
      {
        currentPage?: number;
        pageSize?: number;
        columnId: string;
        desc: "DESC" | "ASC";
        filter: string;
      }
    >({
      query: ({
        columnId = "createdAt",
        currentPage = 0,
        pageSize = ITEMS_PER_PAGE,
        desc = "DESC",
        filter = "",
      }) =>
        `/messages/paginated?page=${currentPage}&pageSize=${pageSize}&columnId=${columnId}&desc=${desc}&filter=${filter}`,
      transformResponse: (res: ApiPaginatedMessageResponse) => res.data,
      providesTags: ["Message"],
    }),

    getMessage: builder.query<Message, { messageId: string }>({
      query: ({ messageId }) => `/messages/${messageId}`,
      transformResponse: (res: ApiMessageResponse) => res.data,
      providesTags: ["Message"],
    }),

    updateMessage: builder.mutation({
      query: (messageId: string) => ({
        url: `/messages/${messageId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Message"],
    }),

    deleteMessage: builder.mutation({
      query: (messageId: string) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetPaginatedMessagesQuery,
  useDeleteMessageMutation,
  useGetMessageQuery,
  useUpdateMessageMutation,
} = contactSlice;
