<script lang="ts" setup>
import { Slash } from "lucide-vue-next";
import { computed, type FunctionalComponent, type HTMLAttributes } from "vue";
import { AuthType } from "webrm-shared";
import { cn } from "~/lib/utils";
import { useAuthStore } from "~/stores/auth";


const props = defineProps<{
  icon: FunctionalComponent,
  caption: string,
  actionUrl?: string,
  actionCaption?: string,
  isAdminAction?: boolean,
  class?: HTMLAttributes["class"],
}>();

const authStore = useAuthStore();
const showAction = computed(() => (
  typeof props.actionCaption != "undefined"
  && typeof props.actionUrl != "undefined"
  && (
    ! props.isAdminAction || authStore.auth?.type === AuthType.Admin
  )
));
</script>

<template>
  <div :class="cn('flex flex-col pt-10 items-center gap-6', props.class)">
    <div class="grid grid-stack items-center justify-items-center">
      <component :is="props.icon" class="size-20 text-gray-300"/>
      <Slash
        :style="{
          '--outline': '2px',
          filter: [
            'drop-shadow(var(--outline) var(--outline) 0 hsl(var(--background)))',
            'drop-shadow(var(--outline) calc(var(--outline) * -1) 0 hsl(var(--background)))',
            'drop-shadow(calc(var(--outline) * -1) var(--outline) 0 hsl(var(--background)))',
            'drop-shadow(calc(var(--outline) * -1) calc(var(--outline) * -1) 0 hsl(var(--background)))',
          ].join(' '),
        }"
        class="size-24 text-foreground"
      />
    </div>
    <div class="flex flex-col gap-2 items-center">
      <h2 class="text-2xl text-muted-foreground">{{ props.caption }}</h2>
      <p v-if="showAction" class="text-muted-foreground">
        <RouterLink
          :to="props.actionUrl"
          active-class=""
          class="text-primary hover:underline focus:underline"
          exact-active-class=""
        >
          Click here
        </RouterLink>
        to {{ props.actionCaption }}
      </p>
    </div>
  </div>
</template>
