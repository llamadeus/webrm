import { useOrdersStore } from "~/stores/orders";
import { handler } from "~/sync/utils";


export const handleOrderDeleted = handler("order-deleted", (event) => {
  const ordersStore = useOrdersStore();

  ordersStore.deleteOrder(event.data.id);
});
