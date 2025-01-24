<script lang="ts" setup>
import { Primitive, type PrimitiveProps } from "radix-vue";
import { type ButtonHTMLAttributes, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";
import { type ButtonVariants, buttonVariants } from "./index";


interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
  type?: ButtonHTMLAttributes["type"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild ?? false"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :type="props.type ?? (props.as == 'button' ? 'button' : undefined)"
  >
    <slot/>
  </Primitive>
</template>
