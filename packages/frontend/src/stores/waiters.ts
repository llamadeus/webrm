import { defineStore } from "pinia";
import type { BackendApi } from "webrm-shared";


export type Waiter = BackendApi["GET /waiters"]["output"][number];

interface State {
  waiters: Waiter[];
}

export const useWaitersStore = defineStore("waiters", {
  state: (): State => ({
    waiters: [],
  }),
  actions: {
    setWaiters(waiters: Waiter[]) {
      this.waiters = waiters;
    },
    addWaiter(waiter: Waiter) {
      this.waiters.push(waiter);
    },
    deleteWaiter(id: string) {
      this.waiters = this.waiters.filter((waiter: Waiter) => waiter.id !== id);
    },
  },
});
