export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface PrefixType {
  [name: string]: any;
}

export interface RequestOptions {
  method: RequestMethod;
  headers: PrefixType;
  body?: string;
}

export interface Token {
  accessToken: string;
  expiresIn: string;
}

export interface ClientRequestOptions {
  overrideDefaultBaseUrl?: boolean;
  headers?: PrefixType;
  token?: Token;
  redirectIfUnauthorized?: boolean;
}

export type ClientResponse<T = any, E = any> =
  | {
      data: T;
      status: number;
    }
  | {
      error: E;
      status: number;
    };

export interface DownloadResponse {
  status: number;
  error?: any;
  isSuccess: boolean;
}
