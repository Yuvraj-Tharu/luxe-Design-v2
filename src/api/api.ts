import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

const cookies = new Cookies();

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_APP_API_URL}`,
  prepareHeaders: async (headers) => {
    const cookieValue = cookies.get('accessToken');
    if (cookieValue) {
      headers.set('Authorization', `Bearer ${cookieValue}`);
    }
    headers.set('Accept', 'application/json');
    return headers;
  },
});

const redirectToLogin = () => {
  cookies.remove('accessToken', { path: '/' });
  window.location.href = '/';
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (window.location.pathname !== '/') {
      redirectToLogin();
    }
  }
  return result;
};

export const fetchApi = createApi({
  reducerPath: 'fetchApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllData: builder.query({
      query: ({ url, params }) => ({
        url,
        method: 'GET',
        params,
      }),
    }),
    getDataById: builder.query({
      query: (url) => ({
        url,
        method: 'GET',
      }),
    }),
    deleteData: builder.mutation({
      query: (url) => ({
        url,
        method: 'DELETE',
      }),
    }),
    createData: builder.mutation({
      query: ({ url, newData }) => ({
        url,
        method: 'POST',
        body: newData,
      }),
    }),
    updateData: builder.mutation({
      query: ({ url, updateData }) => ({
        url,
        method: 'PUT',
        body: updateData,
      }),
    }),
  }),
});

export const {
  useGetAllDataQuery,
  useGetDataByIdQuery,
  useDeleteDataMutation,
  useCreateDataMutation,
  useUpdateDataMutation,
} = fetchApi;
