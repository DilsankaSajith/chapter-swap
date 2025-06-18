import { apiSlice } from "./apiSlice";
import { MESSAGES_URL } from "../constants";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchMessages: builder.query({
      query: (chatId) => ({
        url: `${MESSAGES_URL}/${chatId}`,
      }),
      providesTags: ["Message"],
      keepUnusedDataFor: 5,
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: MESSAGES_URL,
        method: "POST",
        body: data,
      }),
      providesTags: ["Message"],
    }),
  }),
});

export const { useFetchMessagesQuery, useSendMessageMutation } =
  messageApiSlice;
