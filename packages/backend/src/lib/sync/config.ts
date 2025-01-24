import { AuthType, type SyncEvent } from "webrm-shared";


export const receivers: Record<string, AuthType[]> = {
  "menu-item-created": [AuthType.Admin, AuthType.Waiter, AuthType.TableTerminal],
  "menu-item-deleted": [AuthType.Admin, AuthType.Waiter, AuthType.TableTerminal],
  "table-created": [AuthType.Admin, AuthType.Waiter, AuthType.AreaTerminal],
  "table-deleted": [AuthType.Admin, AuthType.Waiter, AuthType.AreaTerminal],
  "waiter-created": [AuthType.Admin],
  "waiter-deleted": [AuthType.Admin],
  "area-updated": [AuthType.Admin],
  "terminal-linked": [AuthType.Admin],
  "terminal-updated": [AuthType.Admin],
  "terminal-unlinked": [AuthType.Admin],
  "orders-created": [AuthType.Admin, AuthType.Waiter, AuthType.AreaTerminal],
  "order-updated": [AuthType.Admin, AuthType.Waiter, AuthType.AreaTerminal],
  "order-deleted": [AuthType.Admin, AuthType.Waiter, AuthType.AreaTerminal],
} satisfies Record<SyncEvent["type"], AuthType[]>;
