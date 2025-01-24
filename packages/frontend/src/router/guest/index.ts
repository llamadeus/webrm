import type { RouteRecordRaw } from "vue-router";


export const guestRoutes: RouteRecordRaw[] = [
  {
    path: "register",
    component: () => import("~/features/register/View.vue"),
  },
  {
    path: "register/:token",
    component: () => import("~/features/register-waiter/View.vue"),
  },
  {
    path: "login",
    name: "login",
    component: () => import("~/features/login/View.vue"),
  },
  {
    path: "link",
    component: () => import("~/features/link/View.vue"),
  },
];
