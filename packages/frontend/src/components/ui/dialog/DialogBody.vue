<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<{
  class?: HTMLAttributes["class"],
}>();
</script>

<template>
  <div :class="cn('flex flex-col flex-1 gap-4 pt-4 pb-6', props.class)">
    <slot/>
  </div>
</template>
