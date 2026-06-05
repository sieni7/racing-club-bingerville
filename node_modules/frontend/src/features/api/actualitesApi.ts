import { apiSlice } from '../../services/api';

export const actualitesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActualites: builder.query({
      query: () => '/actualites',
      providesTags: ['Actualite'],
    }),
    getActualiteById: builder.query({
      query: (id) => `/actualites/${id}`,
      providesTags: ['Actualite'],
    }),
  }),
});

export const { useGetActualitesQuery, useGetActualiteByIdQuery } = actualitesApi;
