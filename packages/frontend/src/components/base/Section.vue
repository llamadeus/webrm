<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";


const props = defineProps<{
  title?: string,
  withCard?: boolean,
  loading?: boolean,
  class?: HTMLAttributes["class"],
  titleClass?: HTMLAttributes["class"],
  contentClass?: HTMLAttributes["class"],
}>();

defineSlots<{
  default: () => void,
  actions?: () => void
}>();
</script>

<template>
  <section :class="cn('flex flex-col flex-1 pt-10 px-8 gap-12', props.class)">
    <div v-if="typeof title != 'undefined'" class="flex">
      <h1 :class="cn('flex-1 text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight', props.titleClass)">
        {{ title }}
      </h1>

      <slot name="actions"/>
    </div>

    <div
      :class="cn(
        'flex flex-col flex-1 pb-10',
        props.withCard && 'bg-background -mx-6 px-6 pt-6 rounded-t-xl shadow-xl border border-b-0',
        props.contentClass
      )"
    >
      <div :class="cn('flex flex-col flex-1 transition-opacity', props.loading && 'opacity-0')">
        <slot/>
      </div>
    </div>
  </section>
</template>
