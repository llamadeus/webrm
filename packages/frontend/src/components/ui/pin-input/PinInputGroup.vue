<script lang="ts" setup>
import { Primitive, type PrimitiveProps, useForwardProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<PrimitiveProps & { class?: HTMLAttributes["class"] }>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <Primitive :class="cn('flex items-center', props.class)" v-bind="forwardedProps">
    <slot/>
  </primitive>
</template>
