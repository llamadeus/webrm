import { defineStore } from "pinia";
import { type MappedAPI, OrderStatus } from "webrm-shared";


export type Order = MappedAPI["GET /orders"]["output"][number];

interface State {
  orders: Order[];
  filter: Set<string> | null;
}

export const useOrdersStore = defineStore("orders", {
  state: (): State => ({
    orders: [],
    filter: null,
  }),
  getters: {
    filtered(this: { filter: Set<string> | null; orders: Order[] }, state: State): Order[] {
      const filter = state.filter;
      if (filter === null) {
        return this.orders;
      }

      return this.orders.filter((order) => (
        filter.has(order.menuItem.category)
      ));
    },
    pending(this: { filtered: Order[]; }): Order[] {
      return this.filtered.filter((order) => order.status === OrderStatus.Pending);
    },
    ready(this: { filtered: Order[]; }): Order[] {
      return this.filtered.filter((order) => order.status === OrderStatus.Ready);
    },
    delivered(this: { filtered: Order[]; }): Order[] {
      return this.filtered.filter((order) => order.status === OrderStatus.Delivered);
    },
  },
  actions: {
    setOrders(orders: Order[]) {
      this.orders = orders;
    },
    setCategoriesFilter(categories: string[] | null) {
      this.filter = categories !== null ? new Set(categories) : null;
    },
    addOrder(order: Order) {
      this.orders.push(order);
    },
    mergeOrders(orders: Order[]) {
      const clone = [...this.orders];
      const existing = Object.fromEntries(this.orders.map((order: Order, index: number) => [order.id, index]));

      for (const order of orders) {
        const index = existing[order.id];
        const old = clone[index];

        if (typeof old == "undefined") {
          clone.push(order);
        }
        else {
          clone[index] = {
            ...old,
            ...order,
          };
        }
      }

      this.orders = clone;
    },
    updateOrder(update: Pick<Order, "id" | "status">) {
      const index = this.orders.findIndex((order: Order) => order.id === update.id);
      const order = this.orders[index];
      if (typeof order == "undefined") {
        return;
      }

      const clone = [...this.orders];
      clone[index] = {
        ...order,
        ...update,
      };

      this.orders = clone;
    },
    deleteOrder(id: string) {
      this.orders = this.orders.filter((order: Order) => order.id !== id);
    },
  },
});
