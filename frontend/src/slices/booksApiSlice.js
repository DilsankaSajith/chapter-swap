import { apiSlice } from "./apiSlice";
import { BOOKS_URL } from "../constants";

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: () => ({
        url: BOOKS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Book"],
    }),
    createBook: builder.mutation({
      query: (data) => ({
        url: BOOKS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Book"],
    }),
  }),
});

export const { useGetBooksQuery, useCreateBookMutation } = booksApiSlice;
