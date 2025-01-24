<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<{
  class?: HTMLAttributes["class"],
}>();
</script>

<template>
  <div :class="cn('grid grid-cols-3 gap-4', props.class)">
    <slot/>
  </div>
</template>
