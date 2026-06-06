import { apiSlice } from '../../services/api';
import type { EndpointBuilder } from '@reduxjs/toolkit/query';

export const matchsApi = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    getMatchs: builder.query<any, any>({
      query: (filters: any) => {
        let qs = '';
        if (filters) {
          const params = new URLSearchParams();
          if (filters.saison) params.append('saison', filters.saison);
          if (filters.statut) params.append('statut', filters.statut);
          qs = `?${params.toString()}`;
        }
        return `/matchs${qs}`;
      },
      providesTags: ['Match'],
    }),
    getMatchById: builder.query<any, string>({
      query: (id: any) => `/matchs/${id}`,
      providesTags: ['Match'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    createMatch: builder.mutation<any, any>({
      query: (match: any) => ({
        url: '/matchs',
        method: 'POST',
        body: match,
      }),
      invalidatesTags: ['Match'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    updateMatch: builder.mutation<any, any>({
      query: ({ id, ...patch }: any) => ({
        url: `/matchs/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Match'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    deleteMatch: builder.mutation<any, string>({
      query: (id: any) => ({
        url: `/matchs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Match'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    updateComposition: builder.mutation<any, any>({
      query: ({ id, composition }: any) => ({
        url: `/matchs/${id}/composition`,
        method: 'PUT',
        body: { composition },
      }),
      invalidatesTags: ['Match'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    addMatchEvent: builder.mutation<any, any>({
      query: ({ id, event }: any) => ({
        url: `/matchs/${id}/events`,
        method: 'POST',
        body: event,
      }),
      invalidatesTags: ['Match'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
  }),
});

export const { 
  useGetMatchsQuery, 
  useGetMatchByIdQuery, 
  useCreateMatchMutation,
  useUpdateMatchMutation,
  useDeleteMatchMutation,
  useUpdateCompositionMutation,
  useAddMatchEventMutation
} = matchsApi;
