<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<{
  class?: HTMLAttributes["class"],
}>();
</script>

<template>
  <h3 :class="cn('flex flex-1 gap-2 items-center font-semibold leading-none tracking-tight', props.class)">
    <slot/>
  </h3>
</template>
