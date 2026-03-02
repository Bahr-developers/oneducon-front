// tokenStore.ts
const KEY = "accessToken";

export const tokenStore = {
  get() {
    return sessionStorage.getItem(KEY);
  },
  set(token: string | null) {
    if (token) sessionStorage.setItem(KEY, token);
    else sessionStorage.removeItem(KEY);
  },
  clear() {
    sessionStorage.removeItem(KEY);
  },
};