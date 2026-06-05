import { api } from '../../services/api';

export const statsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTopButeurs: builder.query<{ success: boolean, data: Record<string, unknown>[] }, { saison?: string, limit?: number }>({
      query: (params) => ({
        url: '/stats/buteurs',
        method: 'GET',
        params,
      }),
      providesTags: ['Stats'],
    }),
    getTopPasseurs: builder.query<{ success: boolean, data: Record<string, unknown>[] }, { saison?: string, limit?: number }>({
      query: (params) => ({
        url: '/stats/passeurs',
        method: 'GET',
        params,
      }),
      providesTags: ['Stats'],
    }),
    recalculateAllStats: builder.mutation<{ success: boolean, message: string }, string>({
      query: (saison) => ({
        url: `/stats/recalculate/${saison}`,
        method: 'POST',
      }),
      invalidatesTags: ['Stats'],
    }),
  }),
});

export const {
  useGetTopButeursQuery,
  useGetTopPasseursQuery,
  useRecalculateAllStatsMutation,
} = statsApi;
