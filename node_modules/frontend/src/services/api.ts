import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  credentials: 'include',
  prepareHeaders: (headers) => {
    return headers;
  },
});

const baseQueryWithReauth = async (args: string | import('@reduxjs/toolkit/query').FetchArgs, api: import('@reduxjs/toolkit/query').BaseQueryApi, extraOptions: Record<string, unknown>) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401 && (typeof args === 'object' && args !== null && 'url' in args && args.url !== '/auth/login' && args.url !== '/auth/refresh')) {
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );
    
    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch({ type: 'auth/logout' });
    }
  }
  
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Joueur', 'Match', 'Stats', 'Actualite'],
  endpoints: () => ({}),
});
