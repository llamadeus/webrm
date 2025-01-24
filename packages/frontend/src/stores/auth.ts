import { defineStore } from "pinia";
import type { BackendApi } from "webrm-shared";


export type Auth = BackendApi["GET /auth"]["output"];

interface State {
  auth: Auth | null | undefined;
}

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    auth: null,
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
