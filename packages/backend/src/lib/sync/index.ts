import type { SyncEvent } from "webrm-shared";
import { receivers } from "~/lib/sync/config";
import { socket } from "~/socket";


export const sync = {
  publish: (restaurantId: string, event: SyncEvent) => {
    const roles = receivers[event.type];
    if (typeof roles == "undefined") {
      throw new Error("No roles for event type");
    }

    socket.toRestaurant(restaurantId, roles).emit("sync", event);
  },
};
