import { defineStore } from "pinia";
import type { MappedAPI } from "webrm-shared";


export type Auth = MappedAPI["GET /auth"]["output"];

interface State {
  auth: Auth | null | undefined;
}

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    auth: undefined,
  }),
  actions: {
    setAuth(auth: Auth | null) {
      this.auth = auth;
    },
    hasData() {
      return typeof this.auth != "undefined";
    },
    clearAuth() {
      this.auth = undefined;
    },
  },
});
