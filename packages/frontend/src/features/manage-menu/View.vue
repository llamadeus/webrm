<script lang="ts" setup>
import { BookOpenText, MoreVertical } from "lucide-vue-next";
import { computed, onMounted, ref, watchEffect } from "vue";
import { toast } from "vue-sonner";
import { api } from "~/api";
import { Container, Section } from "~/components/base";
import { FilterTabs } from "~/components/filter-tabs";
import { PrettyPrice } from "~/components/orders";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Empty } from "~/components/util";
import AddMenuItemDialog from "~/features/manage-menu/components/AddMenuItemDialog.vue";
import { useGlobal } from "~/stores/global";
import { useMenuItemsStore } from "~/stores/menu-items";
import { getErrorMessage } from "~/utils/error";


const ALL_KEY = "all";

// Stores
const menuItemsStore = useMenuItemsStore();
const active = useGlobal<string>("tables:active", ALL_KEY);

// State
const loading = ref(true);
const open = ref(false);
const dialogMenuItemId = ref<string | null>(null);

// Computed
const tabs = computed(() => {
  return [
    {
      key: ALL_KEY,
      caption: "All",
      badge: menuItemsStore.menuItems.length,
    },
    ...menuItemsStore.categories().map((category) => ({
      key: `#${category}`,
      caption: category,
      badge: menuItemsStore.menuItems.filter((menuItem) => menuItem.category === category).length,
    })),
  ];
});
const filtered = computed(() => {
  const items = active.value === ALL_KEY
    ? menuItemsStore.menuItems
    : menuItemsStore.menuItems.filter((menuItem) => menuItem.category === active.value.substring(1));

  return items.toSorted((a, b) => {
    const category = a.category.localeCompare(b.category);
    if (category !== 0) {
      return category;
    }

    return a.name.localeCompare(b.name);
  });
});

onMounted(async () => {
  try {
    const menuItems = await api("GET /menu-items");

    menuItemsStore.setMenuItems(menuItems);
    loading.value = false;
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});

watchEffect(() => {
  if (! tabs.value.some((tab) => tab.key === active.value)) {
    active.value = ALL_KEY;
  }
});

async function handleDelete(id: string) {
  try {
    await api("DELETE /menu-items/:id", {
      params: {
        id,
      },
    });

    toast.success("Menu item deleted");
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
}
</script>

<template>
  <Container>
    <Section :loading="loading" content-class="gap-8" title="Menu" with-card>
      <template #actions>
        <AddMenuItemDialog :categories="menuItemsStore.categories()"/>
      </template>

      <Empty
        v-if="menuItemsStore.menuItems.length == 0"
        :icon="BookOpenText"
        caption="No menu items found"
        is-admin-action
      />

      <template v-else>
        <FilterTabs :active="active" :items="tabs" @change="active = $event"/>

        <Table>
          <TableCaption>A list of items on your menu.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead class="w-24">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead/>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="menuItem in filtered" :key="menuItem.id">
              <TableCell>{{ menuItem.id }}</TableCell>
              <TableCell class="font-semibold">{{ menuItem.name }}</TableCell>
              <TableCell>
                <Badge variant="secondary">{{ menuItem.category }}</Badge>
              </TableCell>
              <TableCell class="text-right">
                <PrettyPrice :price="menuItem.price" no-small/>
              </TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button size="icon" variant="outline">
                      <MoreVertical/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      as-child
                      variant="destructive"
                      @click="dialogMenuItemId = menuItem.id; open = true"
                    >
                      <button>Delete</button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </template>

      <AlertDialog :open="open" @update:open="open = $event">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you really want to delete this menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="dialogMenuItemId !== null && handleDelete(dialogMenuItemId)">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Section>
  </Container>
</template>
