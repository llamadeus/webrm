import { io, Socket } from "socket.io-client";
import type { SyncEvent } from "webrm-shared";
import { handleAreaUpdated } from "~/sync/handlers/area-updated";
import { handleMenuItemCreated } from "~/sync/handlers/menu-item-created";
import { handleMenuItemDeleted } from "~/sync/handlers/menu-item-deleted";
import { handleOrderDeleted } from "~/sync/handlers/order-deleted";
import { handleOrderUpdated } from "~/sync/handlers/order-updated";
import { handleOrdersCreated } from "~/sync/handlers/orders-created";
import { handleTableCreated } from "~/sync/handlers/table-created";
import { handleTableDeleted } from "~/sync/handlers/table-deleted";
import { handleTerminalLinked } from "~/sync/handlers/terminal-linked";
import { handleTerminalUnlinked } from "~/sync/handlers/terminal-unlinked";
import { handleTerminalUpdated } from "~/sync/handlers/terminal-updated";
import { handleWaiterCreated } from "~/sync/handlers/waiter-created";
import { handleWaiterDeleted } from "~/sync/handlers/waiter-deleted";


const HANDLERS = Object.fromEntries([
  handleAreaUpdated,
  handleTableCreated,
  handleTableDeleted,
  handleMenuItemCreated,
  handleMenuItemDeleted,
  handleWaiterCreated,
  handleWaiterDeleted,
  handleTerminalLinked,
  handleTerminalUpdated,
  handleTerminalUnlinked,
  handleOrderUpdated,
  handleOrderDeleted,
  handleOrdersCreated,
].map((handler) => [handler.type as string, handler.handler]));

let socket: Socket | null = null;

export const sync = {
  initialize() {
    if (socket !== null && socket.connected) {
      return;
    }

    socket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
    });

    socket.on("ping", callback => callback());

    socket.on("reload", () => {
      window.location.reload();
    });

    socket.on("redirect", (url: string) => {
      window.location.href = url;
    });

    socket.on("sync", (data: SyncEvent) => {
      try {
        const handler = HANDLERS[data.type];

        if (typeof handler == "undefined") {
          console.error("Missing handler for event:", data.type);
          return;
        }

        handler(data);
      }
      catch (error) {
        console.error("Failed to process message:", error);
      }
    });

    socket.on("disconnect", () => {
      //
    });
  },
};
