'use client';

import { useCallback } from 'react';
import {
  ClientRequestOptions,
  DownloadResponse,
  RequestMethod,
  RequestOptions,
  Token,
} from '@/interface';
import { useRecoilState } from 'recoil';
import { authAtom } from '@/state';
import config from '@/config';
import { useRouter } from 'next/navigation';

export const useClient = () => {
  const baseApiUrl = config.API_URL;
  const [session, setSession] = useRecoilState(authAtom);
  const { push } = useRouter();

  const generateAuthHeader = useCallback((auth?: Token) => {
    const token = auth && auth.accessToken;
    const isLoggedIn = !!token;

    if (isLoggedIn) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return {};
    }
  }, []);

  async function handleResponse<R = any, E = any>(
    response: globalThis.Response,
    redirectIfUnauthorized = true,
  ) {
    return response
      .json()
      .then(async (data) => {
        if (!response.ok) {
          if (response.status === 401 && redirectIfUnauthorized) {
            setSession(null);
            localStorage.clear();
            push('/');
          }

          const error: E = (data && data.message) || response.statusText;

          return {
            error,
            status: response.status,
            data: undefined,
          };
        }

        const responseData: R = data.message || data;

        return {
          data: responseData,
          status: response.status,
          error: undefined,
        };
      })
      .catch((error) => {
        return {
          data: undefined,
          status: response.status,
          error: error.message || 'An error occurred',
        };
      });
  }

  const request = useCallback(
    (method: RequestMethod) => {
      /**
       * @description This method makes an API Call using the provided
       * @param url The url to make the request to. The base URL of
       * @param body The body of the request.
       * @param options Extra options to modify the behaviour of the request.
       */
      return async function requestHandler<Response = any, Body = any, Error = any>(
        url: string,
        body?: Body,
        options?: ClientRequestOptions,
      ) {
        const requestOptions: RequestOptions = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...generateAuthHeader(options?.token || session || undefined),
            ...options?.headers,
          },
        };

        if (body) {
          requestOptions.headers['Content-Type'] = 'application/json';
          requestOptions.body = JSON.stringify(body);
        }

        const hideSlash = url.startsWith('/');
        const baseUrl = options?.overrideDefaultBaseUrl ? '' : baseApiUrl + (hideSlash ? '' : '/');
        const requestUrl = `${baseUrl}${url}`;

        return fetch(requestUrl, requestOptions)
          .then((response) => {
            return handleResponse<Response, Error>(response, options?.redirectIfUnauthorized);
          })
          .catch((error: Error) => {
            return { error, status: 500, data: undefined };
          });
      };
    },
    [session],
  );

  async function handleDownloadResponse(
    response: globalThis.Response,
    redirectIfUnauthorized = true,
  ): Promise<DownloadResponse> {
    if (!response.ok) {
      if (response.status === 401 && redirectIfUnauthorized) {
        setSession(null);
      }

      return { status: response.status, isSuccess: false, error: response.statusText };
    }

    try {
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1];
      link.download = filename || `${Date.now()}`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        status: response.status,
        isSuccess: true,
        error: undefined,
      };
    } catch (error) {
      return {
        status: 500,
        isSuccess: false,
        error: String(error?.toString()) || 'An error occurred',
      };
    }
  }

  const makeDownloadRequest = useCallback(
    (method: RequestMethod) => {
      return async function requestHandler(
        url: string,
        body?: any,
        options?: ClientRequestOptions,
      ): Promise<DownloadResponse> {
        const requestOptions: RequestOptions = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...generateAuthHeader(options?.token || session || undefined),
            ...options?.headers,
          },
        };

        if (body) {
          requestOptions.headers['Content-Type'] = 'application/json';
          requestOptions.body = JSON.stringify(body);
        }

        const hideSlash = url.startsWith('/');
        const baseUrl = options?.overrideDefaultBaseUrl ? '' : baseApiUrl + (hideSlash ? '' : '/');
        const requestUrl = `${baseUrl}${url}`;

        return fetch(requestUrl, requestOptions)
          .then((response) => {
            return handleDownloadResponse(response, options?.redirectIfUnauthorized);
          })
          .catch((error) => {
            return { error, status: 500, isSuccess: false };
          });
      };
    },
    [session],
  );

  return {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
    patch: request('PATCH'),
    download: {
      get: makeDownloadRequest('GET'),
      post: makeDownloadRequest('POST'),
      put: makeDownloadRequest('PUT'),
      delete: makeDownloadRequest('DELETE'),
      patch: makeDownloadRequest('PATCH'),
    },
  };
};
