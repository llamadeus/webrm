<script lang="ts" setup>
import { Minus } from "lucide-vue-next";
import { Primitive, type PrimitiveProps, useForwardProps } from "radix-vue";


const props = defineProps<PrimitiveProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <Primitive v-bind="forwardedProps">
    <slot>
      <Minus/>
    </slot>
  </primitive>
</template>
