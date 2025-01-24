<script lang="ts" setup>
import dayjs from "dayjs";
import { LayoutDashboard } from "lucide-vue-next";
import { computed, onMounted, ref, watchEffect } from "vue";
import { toast } from "vue-sonner";
import { api } from "~/api";
import { Container, Section } from "~/components/base";
import { OrdersTable, PrettyPrice } from "~/components/orders";
import { Summary, SummaryCaption, SummaryItem, SummaryValue } from "~/components/summary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Empty } from "~/components/util";
import { cn } from "~/lib/utils";
import { useGlobal } from "~/stores/global";
import { type MenuItem, useMenuItemsStore } from "~/stores/menu-items";
import { type Order, useOrdersStore } from "~/stores/orders";
import { useTablesStore } from "~/stores/tables";
import { getErrorMessage } from "~/utils/error";


// Stores
const active = useGlobal<string | null>("tables:active", null);
const tablesStore = useTablesStore();
const ordersStore = useOrdersStore();
const menuItemsStore = useMenuItemsStore();

// State
const loading = ref(true);

// Computed
const activeTable = computed(() => tablesStore.sorted.find(item => item.id === active.value) ?? null);
const activeOrders = computed<Order[]>(() => ordersStore.filtered.filter(order => order.table.id === active.value));
const activeOldestOrder = computed(() => {
  return activeOrders.value.toSorted((a, b) => a.createdAt.localeCompare(b.createdAt))[0] ?? null;
});
const activeTotal = computed(() => {
  const menuItems = Object.fromEntries(menuItemsStore.menuItems.map((menuItem) => [menuItem.id, menuItem]));

  return activeOrders.value.reduce((total, order) => {
    const menuItem: MenuItem | undefined = menuItems[order.menuItem.id];
    if (typeof menuItem == "undefined") {
      return total;
    }

    return total + menuItem.price * order.quantity;
  }, 0);
});

onMounted(async () => {
  try {
    const response = await api("GET /tables");

    tablesStore.setTables(response.tables);
    loading.value = false;
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});

onMounted(async () => {
  try {
    const menuItems = await api("GET /menu-items");

    menuItemsStore.setMenuItems(menuItems);
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});

watchEffect(() => {
  if (active.value === null) {
    active.value = tablesStore.sorted[0]?.id ?? null;
  }
  else if (! tablesStore.tables.some((table) => table.id === active.value)) {
    active.value = null;
  }
});

watchEffect(async () => {
  if (activeTable.value === null) {
    return;
  }

  try {
    const orders = await api("GET /tables/:id/orders", {
      params: {
        id: activeTable.value.id,
      },
    });

    ordersStore.mergeOrders(orders);
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});

async function handleFinishTable() {
  if (activeTable.value === null) {
    return;
  }

  try {
    await api("POST /tables/:id/finish", {
      params: {
        id: activeTable.value.id,
      },
    });

    toast.success("Table finished");
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
}
</script>

<template>
  <Container>
    <Section :loading="loading" title="Tables" with-card>
      <Empty
        v-if="tablesStore.tables.length == 0"
        :icon="LayoutDashboard"
        action-caption="create a table"
        action-url="/admin/tables"
        caption="No tables found"
        is-admin-action
      />

      <div v-else class="flex gap-4">
        <div class="flex flex-col gap-1 min-w-32">
          <Button
            v-for="table in tablesStore.sorted"
            :key="table.id"
            :class="cn(
              'relative justify-end transition-all shadow-lg shadow-transparent after:absolute after:right-0 after:border-0 after:border-transparent after:border-l-primary after:border-r-0 after:translate-x-full after:transition-all after:[transition-timing-function:cubic-bezier(0.64,_0.57,_0.67,_1.53)]',
               active === table.id && 'z-10 shadow-black/25 after:border-[0.5rem]'
             )"
            :variant="active === table.id ? 'default' : 'ghost'"
            @click="active = table.id"
          >
            {{ table.name }}
          </Button>
        </div>

        <div class="w-px bg-border"/>

        <div v-if="activeTable !== null" class="flex flex-col flex-1 gap-12">
          <h2 class="text-xl font-semibold">Table {{ activeTable.name }}</h2>

          <Summary>
            <SummaryItem>
              <SummaryValue>{{ activeOrders.length }}</SummaryValue>
              <SummaryCaption>Orders</SummaryCaption>
            </SummaryItem>

            <SummaryItem>
              <SummaryValue>
                <PrettyPrice :price="activeTotal"/>
              </SummaryValue>
              <SummaryCaption>On the Bill</SummaryCaption>
            </SummaryItem>

            <SummaryItem>
              <SummaryValue>{{
                  activeOldestOrder !== null
                    ? dayjs(activeOldestOrder.createdAt).fromNow(true)
                    : "n/a"
                }}
              </SummaryValue>
              <SummaryCaption>Duration</SummaryCaption>
            </SummaryItem>
          </Summary>

          <OrdersTable
            :orders="activeOrders"
            :table-caption="`A list of orders for table ${activeTable.name}.`"
            hide-table-column
          />

          <div class="flex justify-end gap-2">
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="default">Mark as done</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Marking this table as done will delete all orders. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="handleFinishTable">Mark as done</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </Section>
  </Container>
</template>
