import { apiSlice } from '../../services/api';
import type { EndpointBuilder } from '@reduxjs/toolkit/query';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    login: builder.mutation<any, any>({
      query: (credentials: any) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    register: builder.mutation<any, any>({
      query: (userData: any) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: any) => response?.data ?? response,
    }),
    logout: builder.mutation<any, void>({
      query: (): any => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    getMe: builder.query<any, void>({
      query: (): any => '/auth/me',
      providesTags: ['User'],
      transformResponse: (response: any) => response?.data ?? response,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetMeQuery, useLazyGetMeQuery } = authApi;
