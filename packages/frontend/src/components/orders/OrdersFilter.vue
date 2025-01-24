<script lang="ts" setup>
import { computed } from "vue";
import { type FilterItem, FilterTabs } from "~/components/filter-tabs";
import { OrderStatus } from "~/components/orders/index";


const FILTER_ALL = "all";

const props = defineProps<{
  active: OrderStatus | null;
  pending: number;
  ready: number;
  delivered: number;
}>();

const emit = defineEmits<{
  (event: "change", key: OrderStatus | null): void;
}>();

const categories = computed(() => [
  { key: FILTER_ALL, caption: "All", badge: props.pending + props.ready + props.delivered },
  { key: OrderStatus.Pending, caption: "Pending", badge: props.pending },
  { key: OrderStatus.Ready, caption: "Ready", badge: props.ready },
  { key: OrderStatus.Delivered, caption: "Delivered", badge: props.delivered },
] satisfies FilterItem[]);

function handleChange(key: string) {
  emit("change", key !== "all" ? key as OrderStatus : null);
}
</script>

<template>
  <FilterTabs :active="props.active ?? FILTER_ALL" :items="categories" @change="handleChange"/>
</template>
