<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<{
  class?: HTMLAttributes["class"],
}>();
</script>

<template>
  <div :class="cn('flex flex-col items-center gap-1', props.class)">
    <slot/>
  </div>
</template>
