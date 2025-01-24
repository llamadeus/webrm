import type { Component } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { AuthType } from "webrm-shared";
import AuthLayout from "~/components/layouts/AuthLayout.vue";
import { authRoutes } from "~/router/auth";
import { guestRoutes } from "~/router/guest";
import "vue-router";


declare module "vue-router" {
  interface RouteMeta {
    layout?: Component;
    roles?: AuthType | AuthType[] | null;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkExactActiveClass: "bg-gray-500/10",

  routes: [
    {
      path: "/",
      meta: {
        roles: null,
      },
      children: [
        ...guestRoutes,
      ],
    },

    // Terminal routes
    {
      path: "/",
      name: "terminal-home",
      meta: {
        roles: [AuthType.AreaTerminal, AuthType.TableTerminal],
      },
      component: () => import("~/features/terminal/View.vue"),
    },

    // Authentication routes
    {
      path: "/",
      meta: {
        layout: AuthLayout,
        roles: [AuthType.Waiter, AuthType.Admin],
      },
      children: [
        ...authRoutes,
        {
          path: ":pathMatch(.*)*",
          component: () => import("~/components/NotFound.vue"),
        },
      ],
    },

    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("~/components/NotFound.vue"),
    },
  ],
});

export { router };
export default router;
