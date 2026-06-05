import { apiSlice } from '../../services/api';

export const matchsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMatchs: builder.query({
      query: () => '/matchs',
      providesTags: ['Match'],
    }),
    getMatchById: builder.query({
      query: (id) => `/matchs/${id}`,
      providesTags: ['Match'],
    }),
    createMatch: builder.mutation({
      query: (match) => ({
        url: '/matchs',
        method: 'POST',
        body: match,
      }),
      invalidatesTags: ['Match'],
    }),
  }),
});

export const { useGetMatchsQuery, useGetMatchByIdQuery, useCreateMatchMutation } = matchsApi;
