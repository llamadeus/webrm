import { useOrdersStore } from "~/stores/orders";
import { handler } from "~/sync/utils";


export const handleOrderUpdated = handler("order-updated", (event) => {
  const ordersStore = useOrdersStore();

  ordersStore.updateOrder(event.data);
});
