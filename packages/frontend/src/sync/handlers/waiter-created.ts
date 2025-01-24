import { useWaitersStore } from "~/stores/waiters";
import { handler } from "~/sync/utils";


export const handleWaiterCreated = handler("waiter-created", (event) => {
  const waitersStore = useWaitersStore();

  waitersStore.addWaiter(event.data);
});
