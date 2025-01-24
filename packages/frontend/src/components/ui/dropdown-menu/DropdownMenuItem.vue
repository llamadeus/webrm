<script lang="ts" setup>
import { DropdownMenuItem, type DropdownMenuItemProps, useForwardProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { type DropdownMenuItemVariants, dropdownMenuItemVariants } from "~/components/ui/dropdown-menu/index";
import { cn } from "~/lib/utils";


const props = defineProps<DropdownMenuItemProps & {
  variant?: DropdownMenuItemVariants["variant"],
  class?: HTMLAttributes["class"],
  inset?: boolean,
}>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <DropdownMenuItem
    :class="cn(
      dropdownMenuItemVariants({ variant }),
      inset && 'pl-8',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot/>
  </DropdownMenuItem>
</template>
