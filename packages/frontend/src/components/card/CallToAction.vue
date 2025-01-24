<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<{
  description: string,
  class?: HTMLAttributes["class"],
}>();
</script>

<template>
  <div :class="cn('flex flex-col gap-4', props.class)">
    <p class="text-center text-muted-foreground">
      {{ props.description }}
    </p>

    <slot/>
  </div>
</template>
