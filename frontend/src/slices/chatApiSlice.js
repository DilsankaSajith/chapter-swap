import { apiSlice } from "./apiSlice";
import { CHATS_URL, CHATUSERS_URL } from "../constants";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (searchQuery) => ({
        url: `${CHATUSERS_URL}/?search=${searchQuery}`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    fetchChats: builder.query({
      query: () => ({
        url: CHATS_URL,
      }),
      providesTags: ["Chat"],
      keepUnusedDataFor: 5,
    }),
    accessChat: builder.mutation({
      query: (data) => ({
        url: CHATS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    createGroupChat: builder.mutation({
      query: (data) => ({
        url: `${CHATS_URL}/group`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    renameGroupChat: builder.mutation({
      query: (data) => ({
        url: `${CHATS_URL}/grouprename`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    addUserToGroupChat: builder.mutation({
      query: (data) => ({
        url: `${CHATS_URL}/groupadd`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    removeUserFromGroupChat: builder.mutation({
      query: (data) => ({
        url: `${CHATS_URL}/groupremove`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useFetchChatsQuery,
  useAccessChatMutation,
  useCreateGroupChatMutation,
  useRenameGroupChatMutation,
  useAddUserToGroupChatMutation,
  useRemoveUserFromGroupChatMutation,
} = chatApiSlice;
