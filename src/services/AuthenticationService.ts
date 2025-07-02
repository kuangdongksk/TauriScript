import {
  BaseResponse,
  RegisterRequest,
  UserResponse,
  EmailLoginRequest,
  LoginResponse,
  UsernameLoginRequest,
  EmailCodeLoginRequest,
  IList,
  List,
  IListResult,
  ListResultDto,
  IPagedResult,
  PagedResultDto,
  Dictionary,
  IDictionary,
  IRequestOptions,
  IRequestConfig,
  getConfigs,
  axios,
  basePath
} from './index.defs';

export class AuthenticationService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

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
  ): Promise<UserResponse> {
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
  static verify(options: IRequestOptions = {}): Promise<UserResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/verify';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static loginByEmail(
    params: {
      /** requestBody */
      body?: EmailLoginRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/login/email';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static username(
    params: {
      /** requestBody */
      body?: UsernameLoginRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/login/username';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static emailCode(
    params: {
      /** requestBody */
      body?: EmailCodeLoginRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/login/emailCode';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
