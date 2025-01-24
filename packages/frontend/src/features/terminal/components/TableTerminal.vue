<script lang="ts" setup>
import { pluralize } from "@vitest/expect";
import { Box, ChevronUp, Trash2 } from "lucide-vue-next";
import { computed, onMounted, ref, watchEffect } from "vue";
import { toast } from "vue-sonner";
import { api } from "~/api";
import { Container, Section } from "~/components/base";
import { PrettyPrice } from "~/components/orders";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "~/components/ui/number-field";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Empty } from "~/components/util";
import { useKeydownEvent } from "~/hooks";
import { cn } from "~/lib/utils";
import { useAuthStore } from "~/stores/auth";
import { useMenuItemsStore } from "~/stores/menu-items";
import { useTableTerminalStore } from "~/stores/table-terminal";
import { getErrorMessage } from "~/utils/error";


// Stores
const authStore = useAuthStore();
const menuItemsStore = useMenuItemsStore();
const tableTerminalStore = useTableTerminalStore();

// State
const loading = ref(true);
const expanded = ref(false);
const appClasses = ref<string>("");

// Computed
const groupedMenuItems = computed(() => {
  const categories = menuItemsStore.categories();
  const grouped = Object.groupBy(menuItemsStore.menuItems, (item) => item.category);

  return categories.map((category) => {
    const items = grouped[category] ?? [];

    return {
      category,
      items,
    };
  });
});

onMounted(async () => {
  try {
    const menuItems = await api("GET /menu-items", {});

    menuItemsStore.setMenuItems(menuItems);
    loading.value = false;
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});

watchEffect(() => {
  const classes = "relative overflow-hidden after:absolute after:inset-0 after:bg-black/80 after:opacity-0 after:transition-opacity";

  if (tableTerminalStore.hasItems && expanded.value) {
    appClasses.value = document.body.className;
    document.body.classList.add(...classes.split(" "));
    setTimeout(() => {
      document.body.classList.remove("after:opacity-0");
    });
  }
  else {
    // Reset expanded state
    expanded.value = false;

    document.body.classList.add("after:opacity-0");
    setTimeout(() => {
      document.body.className = appClasses.value;
    }, 200);
  }
});

useKeydownEvent((event) => {
  if (! expanded.value) {
    return;
  }

  if (event.key === "Escape") {
    expanded.value = false;
  }
});

async function handleOrder() {
  try {
    await api("PUT /orders", {
      input: tableTerminalStore.entries.map((entry) => ({
        itemId: entry.menuItem.id,
        quantity: entry.quantity,
      })),
    });

    toast.success("Order placed");
    tableTerminalStore.$reset();
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
}
</script>

<template>
  <Container>
    <Section
      :content-class="cn('justify-between', tableTerminalStore.hasItems && 'pb-24')"
      :loading="loading"
      :title="`Osteria da Fortunata &ndash; Table ${authStore.auth?.tableTerminal?.name ?? '<unknown>'}`"
      title-class="font-serif italic text-blue-950"
    >
      <Empty
        v-if="menuItemsStore.menuItems.length == 0"
        :icon="Box"
        caption="Sorry, but there's nothing to order yet"
      />

      <div v-else class="flex flex-col gap-8">
        <div
          v-for="(group, index) in groupedMenuItems"
          :key="index"
          class="flex flex-col gap-4"
        >
          <div class="sticky top-0 -mx-8 px-8 bg-gray-100">
            <h2 class="py-2 text-3xl font-normal border-b">{{ group.category }}</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            <Card v-for="(item, index) in group.items" :key="index">
              <CardHeader class="px-5">
                <CardTitle>
                  {{ item.name }}
                </CardTitle>
                <CardDescription>
                  {{ group.category }}
                </CardDescription>
              </CardHeader>

              <CardFooter class="justify-between px-5 pb-4">
                <div class="text-xl">
                  <PrettyPrice :price="item.price"/>
                </div>
                <Button size="sm" variant="default" @click="tableTerminalStore.addToCart(item.id)">
                  Add
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Teleport to="body">
        <div :class="cn('fixed left-1/2 bottom-0 grid grid-rows-[0fr] w-full max-w-lg -translate-x-1/2 transition-all bg-background border-x border-b-0 shadow-xl rounded-t-lg z-10', tableTerminalStore.hasItems && 'grid-rows-[1fr] border-t')">
          <div class="relative overflow-hidden">
            <div class="flex flex-col max-h-[calc(100vh_-_2.5rem)] overflow-auto">
              <div :class="cn('sticky top-0 bg-background rounded-t-lg grid grid-cols-3 items-center px-6 py-4 z-10', expanded && 'border-b')">
                <div class="text-lg font-semibold">Your order</div>

                <div class="flex gap-2 items-center justify-center">
                  <div class="text-lg">{{ pluralize("item", tableTerminalStore.totalQuantity) }}</div>
                  <div class="hidden sm:block text-xl text-gray-300">/</div>
                  <div class="hidden sm:block text-lg">
                    <PrettyPrice :price="tableTerminalStore.totalPrice"/>
                  </div>
                </div>

                <div class="flex justify-end">
                  <button
                    class="after:absolute after:inset-0 after:cursor-pointer"
                    @click="expanded = !expanded"
                  >
                    <span :class="cn(buttonVariants({ variant: 'default', size: 'icon' }), 'shadow-md shadow-black/50', !expanded && 'animate-breathe')">
                      <ChevronUp :class="cn('transition-transform', expanded && 'rotate-180')"/>
                    </span>
                  </button>
                </div>
              </div>

              <div :class="cn('overflow-hidden grid grid-rows-[0fr] transition-all', expanded && 'grid-rows-[1fr]')">
                <div class="overflow-hidden">
                  <div class="overflow-auto flex flex-col max-h-full gap-6 pt-6 pb-8 px-6">
                    <Table wrapper-class="overflow-visible">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow v-for="entry in tableTerminalStore.entries" :key="entry.id">
                          <TableCell :class="cn('font-semibold', entry.quantity === 0 && 'line-through')">
                            {{ entry.menuItem.name }}
                          </TableCell>
                          <TableCell>
                            <NumberField
                              :model-value="entry.quantity"
                              @update:model-value="tableTerminalStore.updateQuantity(entry.id, $event)"
                            >
                              <NumberFieldContent class="max-w-28">
                                <NumberFieldDecrement>
                                  <template v-if="entry.quantity === 0">
                                    <Trash2 class="h-4 w-4 text-destructive"/>
                                  </template>
                                </NumberFieldDecrement>
                                <NumberFieldInput/>
                                <NumberFieldIncrement/>
                              </NumberFieldContent>
                            </NumberField>
                          </TableCell>
                          <TableCell class="text-right">
                            <PrettyPrice :price="entry.menuItem.price" no-small/>
                          </TableCell>
                          <TableCell class="text-right">
                            <PrettyPrice :price="entry.menuItem.price * entry.quantity" no-small/>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colspan="4">
                            <div class="flex justify-end gap-6">
                              <div class="text-lg font-normal">Total</div>
                              <div class="text-lg font-semibold">
                                <PrettyPrice :price="tableTerminalStore.totalPrice"/>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>

                    <div class="text-right">
                      <Button variant="default" @click="handleOrder">
                        Ordner now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </Section>
  </Container>
</template>
