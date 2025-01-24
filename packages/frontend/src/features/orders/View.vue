<script lang="ts" setup>
import { ClockArrowUp } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { api } from "~/api";
import { Container, Section } from "~/components/base";
import { OrdersFilter, OrdersTable, OrderStatus } from "~/components/orders";
import { Empty } from "~/components/util";
import { useGlobal } from "~/stores/global";
import { type Order, useOrdersStore } from "~/stores/orders";
import { getErrorMessage } from "~/utils/error";


// Stores
const ordersStore = useOrdersStore();
const active = useGlobal<OrderStatus | null>("orders:filter", null);

// State
const loading = ref(true);
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
</script>

<template>
  <Container>
    <Section :loading="loading" content-class="gap-8" title="Orders" with-card>
      <Empty
        v-if="ordersStore.orders.length == 0"
        :icon="ClockArrowUp"
        caption="No orders found"
      />

      <template v-else>
        <OrdersFilter
          :active="active"
          :delivered="ordersStore.delivered.length"
          :pending="ordersStore.pending.length"
          :ready="ordersStore.ready.length"
          @change="active = $event"
        />

        <OrdersTable :orders="filtered as Order[]"/>
      </template>
    </Section>
  </Container>
</template>
