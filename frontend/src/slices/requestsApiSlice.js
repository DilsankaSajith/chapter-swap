import { apiSlice } from "./apiSlice";
import { REQUESTS_URL } from "../constants";

export const requestsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRequests: builder.query({
      query: () => ({
        url: REQUESTS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getRequestById: builder.query({
      query: (requestId) => ({
        url: `${REQUESTS_URL}/${requestId}`,
      }),
      providesTags: ["Request"],
      keepUnusedDataFor: 5,
    }),
    createRequest: builder.mutation({
      query: (data) => ({
        url: REQUESTS_URL,
        method: "POST",
        body: data,
      }),
    }),
    getMyRequests: builder.query({
      query: () => ({
        url: `${REQUESTS_URL}/myRequests`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Request"],
    }),
    getRequestsForMe: builder.query({
      query: () => ({
        url: `${REQUESTS_URL}/requestsForMe`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Request"],
    }),
    updateArrived: builder.mutation({
      query: (requestId) => ({
        url: `${REQUESTS_URL}/${requestId}/arrived`,
        method: "PUT",
      }),
      invalidatesTags: ["Request"],
    }),
    updateDelivered: builder.mutation({
      query: (requestId) => ({
        url: `${REQUESTS_URL}/${requestId}/delivered`,
        method: "PUT",
      }),
      invalidatesTags: ["Request"],
    }),
    acceptRequest: builder.mutation({
      query: (requestId) => ({
        url: `${REQUESTS_URL}/${requestId}/accept`,
        method: "PUT",
      }),
      invalidatesTags: ["Request"],
    }),
    rejectRequest: builder.mutation({
      query: (requestId) => ({
        url: `${REQUESTS_URL}/${requestId}/reject`,
        method: "DELETE",
      }),
      invalidatesTags: ["Request"],
    }),
    cancelRequest: builder.mutation({
      query: (requestId) => ({
        url: `${REQUESTS_URL}/${requestId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Request"],
    }),
  }),
});

export const {
  useGetRequestByIdQuery,
  useGetRequestsQuery,
  useCreateRequestMutation,
  useGetMyRequestsQuery,
  useGetRequestsForMeQuery,
  useUpdateArrivedMutation,
  useUpdateDeliveredMutation,
  useAcceptRequestMutation,
  useRejectRequestMutation,
  useCancelRequestMutation,
} = requestsApiSlice;
