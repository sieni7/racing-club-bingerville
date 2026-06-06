import { apiSlice } from '../../services/api';
import type { EndpointBuilder } from '@reduxjs/toolkit/query';

export const actualitesApi = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    getActualites: builder.query<any, { limit?: number }>({
      query: (params: any) => ({
        url: '/actualites',
        method: 'GET',
        params,
      }),
      providesTags: ['Actualite'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    getActualiteById: builder.query<any, string>({
      query: (id: any) => ({
        url: `/actualites/${id}`,
        method: 'GET',
      }),
      providesTags: (_result: any, _error: any, id: any) => [{ type: 'Actualite', id }],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    createActualite: builder.mutation<any, Record<string, unknown>>({
      query: (body: any) => ({
        url: '/actualites',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Actualite'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    updateActualite: builder.mutation<any, { id: string, body: Record<string, unknown> }>({
      query: ({ id, body }: any) => ({
        url: `/actualites/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result: any, _error: any, { id }: any) => [{ type: 'Actualite', id }, { type: 'Actualite', id: 'LIST' }],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    deleteActualite: builder.mutation<any, string>({
      query: (id: any) => ({
        url: `/actualites/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Actualite'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
  }),
});

export const {
  useGetActualitesQuery,
  useGetActualiteByIdQuery,
  useCreateActualiteMutation,
  useUpdateActualiteMutation,
  useDeleteActualiteMutation,
} = actualitesApi;
