<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<{
  class?: HTMLAttributes["class"],
  wrapperClass?: HTMLAttributes["class"],
}>();
</script>

<template>
  <div :class="cn('relative w-full overflow-auto', props.wrapperClass)">
    <table :class="cn('w-full caption-bottom text-sm', props.class)">
      <slot/>
    </table>
  </div>
</template>
