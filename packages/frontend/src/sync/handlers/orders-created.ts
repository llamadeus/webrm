import { useOrdersStore } from "~/stores/orders";
import { handler } from "~/sync/utils";


export const handleOrdersCreated = handler("orders-created", (event) => {
  const ordersStore = useOrdersStore();

  ordersStore.mergeOrders(event.data);
});
