import { apiSlice } from '../../services/api';

export const joueursApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJoueurs: builder.query({
      query: (status) => `/joueurs${status ? `?status=${status}` : ''}`,
      providesTags: ['Joueur'],
    }),
    getJoueurById: builder.query({
      query: (id) => `/joueurs/${id}`,
      providesTags: ['Joueur'],
    }),
    createJoueur: builder.mutation({
      query: (joueur) => ({
        url: '/joueurs',
        method: 'POST',
        body: joueur,
      }),
      invalidatesTags: ['Joueur'],
    }),
  }),
});

export const { useGetJoueursQuery, useGetJoueurByIdQuery, useCreateJoueurMutation } = joueursApi;
