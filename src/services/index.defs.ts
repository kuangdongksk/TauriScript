/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */
import axiosStatic, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

export interface IRequestOptions extends AxiosRequestConfig {
  /**
   * show loading status
   */
  loading?: boolean;
  /**
   * display error message
   */
  showError?: boolean;
  /**
   * indicates whether Authorization credentials are required for the request
   * @default true
   */
  withAuthorization?: boolean;
}

export interface IRequestPromise<T = any> extends Promise<IRequestResponse<T>> {}

export interface IRequestResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

export interface IRequestInstance {
  (config: any): IRequestPromise;
  (url: string, config?: any): IRequestPromise;
  request<T = any>(config: any): IRequestPromise<T>;
}

export interface IRequestConfig {
  method?: any;
  headers?: any;
  url?: any;
  data?: any;
  params?: any;
}

// Add options interface
export interface ServiceOptions {
  axios?: IRequestInstance;
  /** only in axios interceptor config*/
  loading: boolean;
  showError: boolean;
}

// Add default options
export const serviceOptions: ServiceOptions = {};

// Instance selector
export function axios(configs: IRequestConfig, resolve: (p: any) => void, reject: (p: any) => void): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  } else {
    throw new Error('please inject yourself instance like axios  ');
  }
}

export function getConfigs(method: string, contentType: string, url: string, options: any): IRequestConfig {
  const configs: IRequestConfig = {
    loading: serviceOptions.loading,
    showError: serviceOptions.showError,
    ...options,
    method,
    url
  };
  configs.headers = {
    ...options.headers,
    'Content-Type': contentType
  };
  return configs;
}

export const basePath = '';

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[];
}

export class ListResultDto<T> implements IListResult<T> {
  items?: T[];
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number;
  items?: T[];
}

export class PagedResultDto<T = any> implements IPagedResult<T> {
  totalCount?: number;
  items?: T[];
}

// customer definition
// empty

/** BaseResponse */
export interface BaseResponse {
  /**  */
  msg: string;

  /**  */
  data: any | null;

  /**  */
  code?: number;
}

/** UserResponse */
export interface UserResponse {
  /**  */
  id: number;

  /**  */
  username: string;

  /**  */
  email: string;
}

/** BaseResponse_UserResponse */
export interface BaseResponse_UserResponse {
  /**  */
  msg: string;

  /**  */
  data: UserResponse;

  /**  */
  code?: number;
}

/** RegisterRequest */
export interface RegisterRequest {
  /**  */
  username: string;

  /**  */
  email: string;

  /**  */
  password: string;

  /**  */
  code: string;
}

/** LoginResponse */
export interface LoginResponse {
  /**  */
  token: string;
}

/** BaseResponse_LoginResponse */
export interface BaseResponse_LoginResponse {
  /**  */
  msg: string;

  /**  */
  data: LoginResponse;

  /**  */
  code?: number;
}

/** EmailLoginRequest */
export interface EmailLoginRequest {
  /**  */
  email: string;

  /**  */
  password: string;
}

/** UsernameLoginRequest */
export interface UsernameLoginRequest {
  /**  */
  username: string;

  /**  */
  password: string;
}

/** EmailCodeLoginRequest */
export interface EmailCodeLoginRequest {
  /**  */
  email: string;

  /**  */
  code: string;
}
