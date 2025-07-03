import { atomWithStorage } from "jotai/utils";

export const authTokenA = atomWithStorage('authToken', '');
export const userInfoA = atomWithStorage<{
  username: string;
  email: string;
} | null>('userInfo', null);