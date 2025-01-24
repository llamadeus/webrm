import type { RouteRecordRaw } from "vue-router";
import { AuthType } from "webrm-shared";


export const authRoutes: RouteRecordRaw[] = [
  {
    path: "tables",
    name: "tables",
    meta: {
      roles: [AuthType.Waiter, AuthType.Admin],
    },
    component: () => import("~/features/tables/View.vue"),
  },
  {
    path: "orders",
    meta: {
      roles: [AuthType.Waiter, AuthType.Admin],
    },
    component: () => import("~/features/orders/View.vue"),
  },

  {
    path: "admin/menu",
    meta: {
      roles: [AuthType.Admin],
    },
    component: () => import("~/features/manage-menu/View.vue"),
  },
  {
    path: "admin/tables",
    meta: {
      roles: [AuthType.Admin],
    },
    component: () => import("~/features/manage-tables/View.vue"),
  },
  {
    path: "admin/waiters",
    meta: {
      roles: [AuthType.Admin],
    },
    component: () => import("~/features/manage-waiters/View.vue"),
  },
  {
    path: "admin/terminals",
    meta: {
      roles: [AuthType.Admin],
    },
    component: () => import("~/features/manage-terminals/View.vue"),
  },
  {
    path: "admin/restaurant",
    meta: {
      roles: [AuthType.Admin],
    },
    component: () => import("~/features/manage-restaurant/View.vue"),
  },
];
