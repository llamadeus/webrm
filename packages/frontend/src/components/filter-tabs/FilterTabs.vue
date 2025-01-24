<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { type FilterItem } from "./types";


const props = defineProps<{
  active: string;
  items: FilterItem[];
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits<{
  (event: "change", key: string): void;
}>();
</script>

<template>
  <nav :class="cn('flex gap-2', props.class)" aria-label="Items filter" role="tablist">
    <button
      v-for="(item, index) in items"
      :key="index"
      :aria-selected="props.active === item.key"
      :class="cn('flex gap-2 items-center rounded-md px-3 py-2 text-sm font-medium', props.active === item.key ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700')"
      role="tab"
      @click="emit('change', item.key)"
    >
      {{ item.caption }}
      <Badge v-if="typeof item.badge != 'undefined'" class="rounded-full text-xs font-medium py-0 px-1.5">
        {{ item.badge }}
      </Badge>
    </button>
  </nav>
</template>
