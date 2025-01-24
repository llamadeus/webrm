<script lang="ts" setup>
import { AlertDialogAction, type AlertDialogActionProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";


const props = defineProps<AlertDialogActionProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AlertDialogAction :class="cn(buttonVariants(), props.class)" v-bind="delegatedProps">
    <slot/>
  </AlertDialogAction>
</template>
