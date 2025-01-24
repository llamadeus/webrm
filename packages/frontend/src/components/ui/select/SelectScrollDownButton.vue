<script lang="ts" setup>
import { ChevronDown } from "lucide-vue-next";
import { SelectScrollDownButton, type SelectScrollDownButtonProps, useForwardProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<SelectScrollDownButtonProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectScrollDownButton
    :class="cn('flex cursor-default items-center justify-center py-1', props.class)"
    v-bind="forwardedProps"
  >
    <slot>
      <ChevronDown/>
    </slot>
  </SelectScrollDownButton>
</template>
