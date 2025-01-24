import { useMenuItemsStore } from "~/stores/menu-items";
import { handler } from "~/sync/utils";


export const handleMenuItemDeleted = handler("menu-item-deleted", (event) => {
  const menuItemStore = useMenuItemsStore();

  menuItemStore.deleteMenuItem(event.data.id);
});
