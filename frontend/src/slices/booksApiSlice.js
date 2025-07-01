import { apiSlice } from "./apiSlice";
import { BOOKS_URL } from "../constants";

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: ({ keyword }) => ({
        url: BOOKS_URL,
        params: {
          keyword,
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Book"],
    }),
    getBookDetails: builder.query({
      query: (bookId) => ({
        url: `${BOOKS_URL}/${bookId}`,
      }),
      providesTags: ["Book"],
      keepUnusedDataFor: 5,
    }),
    createBook: builder.mutation({
      query: (data) => ({
        url: BOOKS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Book"],
    }),
    updateBook: builder.mutation({
      query: (data) => ({
        url: `${BOOKS_URL}/${data.bookId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Book"],
    }),
    addToFavorite: builder.mutation({
      query: (bookId) => ({
        url: `${BOOKS_URL}/${bookId}/addToFavorite`,
        method: "PUT",
      }),
      invalidatesTags: ["Book"],
    }),
    deleteBook: builder.mutation({
      query: (bookId) => ({
        url: `${BOOKS_URL}/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${BOOKS_URL}/${data.bookId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Book"],
    }),
    getTopBooks: builder.query({
      query: () => ({
        url: `${BOOKS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),
    getFavoriteBooks: builder.query({
      query: () => ({
        url: `${BOOKS_URL}/favorites`,
      }),
      keepUnusedDataFor: 5,
      invalidatesTags: ["Book"],
    }),
  }),
});

export const {
  useGetFavoriteBooksQuery,
  useAddToFavoriteMutation,
  useGetTopBooksQuery,
  useGetBooksQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
  useGetBookDetailsQuery,
  useUpdateBookMutation,
  useCreateReviewMutation,
} = booksApiSlice;
