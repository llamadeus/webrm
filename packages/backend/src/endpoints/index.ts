import { areas } from "~/endpoints/areas/areas";
import { linkArea } from "~/endpoints/areas/link-area";
import { updateArea } from "~/endpoints/areas/update-area";
import { auth } from "~/endpoints/auth/auth";
import { connect } from "~/endpoints/auth/connect";
import { invitation } from "~/endpoints/auth/invitation";
import { login } from "~/endpoints/auth/login";
import { logout } from "~/endpoints/auth/logout";
import { register } from "~/endpoints/auth/register";
import { registerWithToken } from "~/endpoints/auth/register-with-token";
import { createMenuItem } from "~/endpoints/menu-items/create-menu-item";
import { deleteMenuItem } from "~/endpoints/menu-items/delete-menu-item";
import { menuItems } from "~/endpoints/menu-items/menu-items";
import { createOrder } from "~/endpoints/orders/create-order";
import { deleteOrder } from "~/endpoints/orders/delete-order";
import { orders } from "~/endpoints/orders/orders";
import { updateOrder } from "~/endpoints/orders/update-order";
import { createTable } from "~/endpoints/tables/create-table";
import { deleteTable } from "~/endpoints/tables/delete-table";
import { finishTable } from "~/endpoints/tables/finish-table";
import { linkTable } from "~/endpoints/tables/link-table";
import { tableOrders } from "~/endpoints/tables/table-orders";
import { tables } from "~/endpoints/tables/tables";
import { terminals } from "~/endpoints/terminals/terminals";
import { unlinkTerminal } from "~/endpoints/terminals/unlink-terminal";
import { deleteWaiter } from "~/endpoints/waiters/delete-waiter";
import { inviteWaiter } from "~/endpoints/waiters/invite-waiter";
import { waiters } from "~/endpoints/waiters/waiters";
import { xapi } from "~/lib/xapi";


export const api = xapi.api({
  // Areas
  areas,
  linkArea,
  updateArea,

  // Auth
  auth,
  connect,
  invitation,
  login,
  logout,
  register,
  registerWithToken,

  // Menu items
  createMenuItem,
  deleteMenuItem,
  menuItems,

  // Orders
  createOrder,
  deleteOrder,
  orders,
  updateOrder,

  // Tables
  createTable,
  deleteTable,
  finishTable,
  linkTable,
  tableOrders,
  tables,

  // Terminals
  terminals,
  unlinkTerminal,

  // Waiters
  deleteWaiter,
  inviteWaiter,
  waiters,
});

export type Api = typeof api["endpoints"];
