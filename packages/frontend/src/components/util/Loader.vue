<script lang="ts" setup>
import { LoaderCircle } from "lucide-vue-next";
import { type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<{
  class?: HTMLAttributes["class"],
}>();
</script>

<template>
  <div :class="cn('flex flex-col pt-10 items-center gap-6', props.class)">
    <LoaderCircle class="size-20 animate-spin"/>
    <h2 class="text-2xl text-muted-foreground">Loading...</h2>
  </div>
</template>
