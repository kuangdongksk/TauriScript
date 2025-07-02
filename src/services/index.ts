/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */

/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-nocheck
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

export interface IRequestConfig {
  method?: any;
  headers?: any;
  url?: any;
  data?: any;
  params?: any;
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance;
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

export class AuthenticationService {
  /**
   *
   */
  static sendVerificationCode(
    params: {
      /**  */
      email: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<BaseResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/sendVerificationCode';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { email: params['email'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static register(
    params: {
      /** requestBody */
      body?: RegisterRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<BaseResponse_UserResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/register';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static login(
    params: {
      /** requestBody */
      body?: LoginRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<BaseResponse_LoginResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/login';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static verify(options: IRequestOptions = {}): Promise<BaseResponse_UserResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/verify';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static test(options: IRequestOptions = {}): Promise<BaseResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/test';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}

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

/** LoginRequest */
export interface LoginRequest {
  /**  */
  email: string;

  /**  */
  password: string;
}
