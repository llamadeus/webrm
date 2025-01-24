<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<{
  class?: HTMLAttributes["class"],
}>();
</script>

<template>
  <div :class="cn('flex flex-col flex-1 w-full max-w-5xl mx-auto', props.class)">
    <slot/>
  </div>
</template>
