import { apiSlice } from '../../services/api';

export const statsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalStats: builder.query({
      query: () => '/stats',
      providesTags: ['Stat'],
    }),
  }),
});

export const { useGetGlobalStatsQuery } = statsApi;
