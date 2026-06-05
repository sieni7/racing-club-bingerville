import { api } from '../../services/api';

export const actualitesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActualites: builder.query<{ success: boolean, data: Record<string, unknown>[] }, { limit?: number }>({
      query: (params) => ({
        url: '/actualites',
        method: 'GET',
        params,
      }),
      providesTags: ['Actualite'],
    }),
    getActualiteById: builder.query<{ success: boolean, data: Record<string, unknown> }, string>({
      query: (id) => ({
        url: `/actualites/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Actualite', id }],
    }),
    createActualite: builder.mutation<{ success: boolean, data: Record<string, unknown> }, Record<string, unknown>>({
      query: (body) => ({
        url: '/actualites',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Actualite'],
    }),
    updateActualite: builder.mutation<{ success: boolean, data: Record<string, unknown> }, { id: string, body: Record<string, unknown> }>({
      query: ({ id, body }) => ({
        url: `/actualites/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Actualite', id }, { type: 'Actualite', id: 'LIST' }],
    }),
    deleteActualite: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/actualites/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Actualite'],
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
