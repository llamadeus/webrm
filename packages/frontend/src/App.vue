<script lang="ts" setup>
import { TooltipProvider } from "radix-vue";
import { defineComponent, shallowRef, watchEffect } from "vue";
import { RouterView } from "vue-router";
import { type Auth, AuthType } from "webrm-shared";
import { api } from "~/api";
import { Toaster } from "~/components/ui/sonner";
import { router } from "~/router";
import { useAuthStore } from "~/stores/auth";
import { sync } from "~/sync";


const NoLayout = defineComponent({
  name: "NoLayout",
  setup(_, { slots }) {
    // Just return the default slot with no wrapper
    return () => slots.default?.();
  },
} as never);


const authStore = useAuthStore();
const layout = shallowRef<unknown>(NoLayout);

function checkAuth(auth: Auth | null, roles: AuthType[] | null | undefined): { name: string } | null {
  let authorized = false;

  if (typeof roles == "undefined") {
    // Nothing to do
    return null;
  }

  if (roles === null) {
    authorized = auth === null;
  }
  else {
    if (Array.isArray(roles)) {
      authorized = auth !== null && roles.includes(auth.type);
    }
  }

  if (! authorized) {
    switch (auth?.type ?? null) {
    case null:
      return { name: "login" };
    case AuthType.Admin:
      return { name: "tables" };
    case AuthType.Waiter:
      return { name: "tables" };
    case AuthType.AreaTerminal:
      return { name: "terminal-home" };
    case AuthType.TableTerminal:
      return { name: "terminal-home" };
    }
  }

  return null;
}

router.beforeEach(async (to) => {
  const { roles } = to.meta;

  try {
    const auth = await api("GET /auth", {});
    const redirect = checkAuth(auth as Auth, roles as AuthType[] | null | undefined);
    if (redirect !== null) {
      return redirect;
    }

    layout.value = to.meta.layout ?? NoLayout;
    authStore.setAuth(auth);
  }
  catch (error) {
    console.error("Error while checking authorization", error);
    window.location.reload();
  }
});

watchEffect(() => {
  if (authStore.auth === null) {
    return;
  }

  sync.initialize();
});
</script>

<template>
  <TooltipProvider :delay-duration="1000">
    <component :is="layout" v-if="authStore.hasData()">
      <RouterView/>
    </component>
  </TooltipProvider>

  <Toaster rich-colors/>
</template>
