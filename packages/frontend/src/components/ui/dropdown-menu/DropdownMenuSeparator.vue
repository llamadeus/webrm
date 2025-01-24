<script lang="ts" setup>
import { DropdownMenuSeparator, type DropdownMenuSeparatorProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<DropdownMenuSeparatorProps & {
  class?: HTMLAttributes["class"]
}>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <DropdownMenuSeparator :class="cn('my-1 h-px bg-muted', props.class)" v-bind="delegatedProps"/>
</template>
