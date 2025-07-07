import { atomWithStorage } from "jotai/utils";

export const authTokenA = atomWithStorage('authToken', '未登录');
export const userInfoA = atomWithStorage<{
  username: string;
  email: string;
} | null>('userInfo', null);