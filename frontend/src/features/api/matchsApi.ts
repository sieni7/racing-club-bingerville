import { apiSlice } from '../../services/api';

export const matchsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMatchs: builder.query({
      query: (filters) => {
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
    updateMatch: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/matchs/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Match'],
    }),
    deleteMatch: builder.mutation({
      query: (id) => ({
        url: `/matchs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Match'],
    }),
    updateComposition: builder.mutation({
      query: ({ id, composition }) => ({
        url: `/matchs/${id}/composition`,
        method: 'PUT',
        body: { composition },
      }),
      invalidatesTags: ['Match'],
    }),
    addMatchEvent: builder.mutation({
      query: ({ id, event }) => ({
        url: `/matchs/${id}/events`,
        method: 'POST',
        body: event,
      }),
      invalidatesTags: ['Match'],
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
