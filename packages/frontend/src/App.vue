<script lang="ts" setup>
import { ThumbsUp } from "lucide-vue-next";
import { TooltipProvider } from "radix-vue";
import { defineComponent, shallowRef, watchEffect } from "vue";
import { RouterView } from "vue-router";
import { type Auth, AuthType } from "webrm-shared";
import { api } from "~/api";
import { Toaster } from "~/components/ui/sonner";
import { Empty } from "~/components/util";
import { router } from "~/router";
import { useAuthStore } from "~/stores/auth";
import { sync } from "~/sync";
import { getErrorMessage } from "~/utils/error";


const NoLayout = defineComponent({
  name: "NoLayout",
  setup(_, { slots }) {
    // Just return the default slot with no wrapper
    return () => slots.default?.();
  },
} as never);

// Stores
const authStore = useAuthStore();

// State
const layout = shallowRef<unknown>(NoLayout);
const authError = shallowRef<Error | null>(null);

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
    authError.value = error;
  }
});

watchEffect(() => {
  if (typeof authStore.auth == "undefined" || authStore.auth === null) {
    return;
  }

  sync.initialize();
});
</script>

<template>
  <TooltipProvider :delay-duration="1000">
    <template v-if="authError === null">
      <component :is="layout" v-if="authStore.hasData()">
        <RouterView/>
      </component>
    </template>
    <Empty
      v-else
      :caption="`Error: ${getErrorMessage(authError)}`"
      :icon="ThumbsUp"
      action-caption="reload"
      action-url="/"
      class="pt-24"
    />
  </TooltipProvider>

  <Toaster rich-colors/>
</template>
