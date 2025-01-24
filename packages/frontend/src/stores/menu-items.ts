import { defineStore } from "pinia";
import type { BackendApi } from "webrm-shared";


export type MenuItem = BackendApi["GET /menu-items"]["output"][number];

interface State {
  menuItems: MenuItem[];
}

export const useMenuItemsStore = defineStore("menuItems", {
  state: (): State => ({
    menuItems: [],
  }),
  actions: {
    setMenuItems(menuItems: MenuItem[]) {
      this.menuItems = menuItems;
    },
    addMenuItem(menuItem: MenuItem) {
      this.menuItems.push(menuItem);
    },
    deleteMenuItem(id: string) {
      this.menuItems = this.menuItems.filter((menuItem: MenuItem) => menuItem.id !== id);
    },
    categories() {
      const categories = new Set<string>();

      for (const menuItem of this.menuItems) {
        categories.add(menuItem.category);
      }

      return Array.from(categories).toSorted((a, b) => a.localeCompare(b));
    },
  },
});
