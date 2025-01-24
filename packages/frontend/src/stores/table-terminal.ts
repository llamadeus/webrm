import { defineStore } from "pinia";
import { type MenuItem, useMenuItemsStore } from "~/stores/menu-items";


export interface CartItem {
  itemId: string;
  quantity: number;
}

export interface CartEntry {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

interface State {
  items: CartItem[];
}

export const useTableTerminalStore = defineStore("table-terminal", {
  state: (): State => ({
    items: [],
  }),
  getters: {
    hasItems(state) {
      return state.items.length > 0;
    },
    entries(state): CartEntry[] {
      const menuItemsStore = useMenuItemsStore();
      const menuItemsMap = Object.fromEntries(menuItemsStore.menuItems.map((menuItem: MenuItem) => [menuItem.id, menuItem]));
      const entries: CartEntry[] = [];

      for (const item of state.items) {
        const menuItem = menuItemsMap[item.itemId];
        if (typeof menuItem == "undefined") {
          continue;
        }

        entries.push({
          menuItem,
          id: item.itemId,
          quantity: item.quantity,
        });
      }

      return entries;
    },
    totalQuantity(this: { entries: CartEntry[] }) {
      return this.entries.reduce((total, entry) => total + entry.quantity, 0);
    },
    totalPrice(this: { entries: CartEntry[] }) {
      return this.entries.reduce((total, entry) => total + entry.menuItem.price * entry.quantity, 0);
    },
  },
  actions: {
    addToCart(itemId: string) {
      const clone = [...this.items];
      const index = this.items.findIndex((item) => item.itemId === itemId);
      const item: CartItem = this.items[index] ?? {
        itemId,
        quantity: 1,
      } satisfies CartItem;

      if (index >= 0) {
        clone[index] = {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      else {
        clone.push(item);
      }

      this.items = clone;
    },
    updateQuantity(itemId: string, quantity: number) {
      const clone = [...this.items];
      const index = this.items.findIndex((item) => item.itemId === itemId);
      const item = this.items[index];
      if (typeof item == "undefined") {
        return;
      }

      if (quantity < 0) {
        clone.splice(index, 1);
      }
      else {
        clone[index] = {
          ...this.items[index],
          quantity: Math.max(0, quantity),
        };
      }

      this.items = clone;
    },
  },
});
