import { apiSlice } from '../../services/api';
import type { EndpointBuilder } from '@reduxjs/toolkit/query';

export const joueursApi = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    getJoueurs: builder.query<any, any>({
      query: (filters: any) => {
        let qs = '';
        if (filters) {
          const params = new URLSearchParams();
          if (filters.statut) params.append('statut', filters.statut);
          if (filters.poste) params.append('poste', filters.poste);
          qs = `?${params.toString()}`;
        }
        return `/joueurs${qs}`;
      },
      providesTags: ['Joueur'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    getJoueurById: builder.query<any, string>({
      query: (id: any) => `/joueurs/${id}`,
      providesTags: ['Joueur'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    createJoueur: builder.mutation<any, any>({
      query: (joueur: any) => ({
        url: '/joueurs',
        method: 'POST',
        body: joueur,
      }),
      invalidatesTags: ['Joueur'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    updateJoueur: builder.mutation<any, any>({
      query: ({ id, ...patch }: any) => ({
        url: `/joueurs/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Joueur'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    deleteJoueur: builder.mutation<any, string>({
      query: (id: any) => ({
        url: `/joueurs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Joueur'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
  }),
});

export const { 
  useGetJoueursQuery, 
  useGetJoueurByIdQuery, 
  useCreateJoueurMutation,
  useUpdateJoueurMutation,
  useDeleteJoueurMutation
} = joueursApi;
