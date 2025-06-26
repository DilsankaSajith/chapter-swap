import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    myProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    getOtherProfile: builder.query({
      query: (profileId) => ({
        url: `${USERS_URL}/${profileId}`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    followUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/follow`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    unfollowUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/unfollow`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useMyProfileQuery,
  useGetAllUsersQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetOtherProfileQuery,
} = usersApiSlice;
