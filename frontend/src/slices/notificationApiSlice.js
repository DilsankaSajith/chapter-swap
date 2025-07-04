import { NOTIFICATIONS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: () => ({
        url: NOTIFICATIONS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `${NOTIFICATIONS_URL}/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
    readNotification: builder.mutation({
      query: (notificationId) => ({
        url: `${NOTIFICATIONS_URL}/${notificationId}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useDeleteNotificationMutation,
  useReadNotificationMutation,
} = notificationsApiSlice;
