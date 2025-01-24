import { useWaitersStore } from "~/stores/waiters";
import { handler } from "~/sync/utils";


export const handleWaiterDeleted = handler("waiter-deleted", (event) => {
  const waitersStore = useWaitersStore();

  waitersStore.deleteWaiter(event.data.id);
});
