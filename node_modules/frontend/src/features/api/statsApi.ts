import { apiSlice } from '../../services/api';
import type { EndpointBuilder } from '@reduxjs/toolkit/query';

export const statsApi = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    getTopButeurs: builder.query<any, { saison?: string, limit?: number }>({
      query: (params: { saison?: string, limit?: number } = {}) => ({
        url: '/stats/buteurs',
        method: 'GET',
        params,
      }),
      providesTags: ['Stats'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    getTopPasseurs: builder.query<any, { saison?: string, limit?: number }>({
      query: (params: { saison?: string, limit?: number } = {}) => ({
        url: '/stats/passeurs',
        method: 'GET',
        params,
      }),
      providesTags: ['Stats'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    recalculateAllStats: builder.mutation<any, string>({
      query: (saison) => ({
        url: `/stats/recalculate/${saison}`,
        method: 'POST',
      }),
      invalidatesTags: ['Stats'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
  }),
});

export const {
  useGetTopButeursQuery,
  useGetTopPasseursQuery,
  useRecalculateAllStatsMutation,
} = statsApi;
