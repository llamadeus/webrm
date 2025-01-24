<script lang="ts" setup>
import { ClockArrowUp } from "lucide-vue-next";
import { computed, onMounted, ref, watchEffect } from "vue";
import { toast } from "vue-sonner";
import { TerminalType } from "webrm-shared";
import { api } from "~/api";
import { Container, Section } from "~/components/base";
import { OrdersFilter, OrdersTable } from "~/components/orders";
import { Empty } from "~/components/util";
import { useAuthStore } from "~/stores/auth";
import { useGlobal } from "~/stores/global";
import { useOrdersStore } from "~/stores/orders";
import { getErrorMessage } from "~/utils/error";


// Stores
const authStore = useAuthStore();
const ordersStore = useOrdersStore();
const active = useGlobal<string | null>("area-terminal:order-filter", null);

// Computed
const loading = ref(true);
const title = computed(() => {
  switch (authStore.auth?.areaTerminal?.ref) {
  case TerminalType.Kitchen:
    return "Kitchen";
  case TerminalType.Bar:
    return "Bar";
  default:
    return "Unknown";
  }
});
const filtered = computed(() => {
  if (active.value === null) {
    return ordersStore.filtered;
  }

  return ordersStore.filtered.filter((order) => (
    order.status === active.value
  ));
});

onMounted(async () => {
  try {
    const orders = await api("GET /orders");

    ordersStore.setOrders(orders);
    loading.value = false;
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});

watchEffect(() => {
  ordersStore.setCategoriesFilter(authStore.auth?.areaTerminal?.categories ?? null);
});
</script>

<template>
  <Container>
    <Section :loading="loading" :title="title" content-class="gap-8" with-card>
      <Empty
        v-if="ordersStore.orders.length == 0"
        :icon="ClockArrowUp"
        caption="No active orders"
      />

      <template v-else>
        <OrdersFilter
          :active="active"
          :delivered="ordersStore.delivered.length"
          :pending="ordersStore.pending.length"
          :ready="ordersStore.ready.length"
          @change="active = $event"
        />

        <OrdersTable :orders="filtered"/>
      </template>
    </Section>
  </Container>
</template>
