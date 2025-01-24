import { useMenuItemsStore } from "~/stores/menu-items";
import { handler } from "~/sync/utils";


export const handleMenuItemCreated = handler("menu-item-created", (event) => {
  const menuItemStore = useMenuItemsStore();

  menuItemStore.addMenuItem(event.data);
});
