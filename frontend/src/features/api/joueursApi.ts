import { apiSlice } from '../../services/api';

export const joueursApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJoueurs: builder.query({
      query: (filters) => {
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
    updateJoueur: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/joueurs/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Joueur'],
    }),
    deleteJoueur: builder.mutation({
      query: (id) => ({
        url: `/joueurs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Joueur'],
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
