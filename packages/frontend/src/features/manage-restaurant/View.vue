<script lang="ts" setup>
import { GlassWater, Utensils } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { AreaType, TerminalType } from "webrm-shared";
import { api } from "~/api";
import { Container, Section } from "~/components/base";
import { LinkTerminalDialog } from "~/components/terminal";
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
import AreaCard from "~/features/manage-restaurant/components/AreaCard.vue";
import { useAreasStore } from "~/stores/areas";
import { useMenuItemsStore } from "~/stores/menu-items";
import { useTerminalsStore } from "~/stores/terminals";
import { getErrorMessage } from "~/utils/error";


interface DialogData {
  caption: string;
  type: AreaType;
}

// Stores
const areasStore = useAreasStore();
const terminalsStore = useTerminalsStore();
const menuItemsStore = useMenuItemsStore();

// State
const loading = ref(true);
const open = ref(false);
const dialogData = ref<DialogData | null>(null);
const openDelete = ref(false);
const dialogTerminalRef = ref<string | null>(null);

// Computed
const kitchenTerminal = computed(() => terminalsStore.getTerminal(TerminalType.Kitchen));
const barTerminal = computed(() => terminalsStore.getTerminal(TerminalType.Bar));

onMounted(async () => {
  try {
    const response = await api("GET /areas");

    areasStore.setAreas(response.areas);
    terminalsStore.mergeTerminals(response.terminals);
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

async function handleUpdate(area: AreaType, enabled: boolean | undefined, categories: string[] | undefined) {
  try {
    await api("PATCH /areas/:area", {
      params: {
        area,
      },
      input: {
        enabled,
        categories,
      },
    });

    toast.success("Changes saved");
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
}

async function handleLink(code: string) {
  if (dialogData.value === null) {
    return;
  }

  try {
    await api("POST /areas/:area/link", {
      params: {
        area: dialogData.value.type,
      },
      input: {
        code,
      },
    });

    toast.success("Terminal linked");
    open.value = false;
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
}

async function handleUnlink(ref: string) {
  try {
    await api("DELETE /terminals/:ref", {
      params: {
        ref,
      },
    });

    toast.success("Terminal unlinked");
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
}
</script>

<template>
  <Container>
    <Section :loading="loading" title="Restaurant">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AreaCard
          :active-categories="areasStore.areas.kitchen.categories"
          :categories="menuItemsStore.categories()"
          :connection="kitchenTerminal?.connection ?? null"
          :enabled="areasStore.areas.kitchen.enabled"
          :icon="Utensils"
          :linked="kitchenTerminal !== null"
          caption="Kitchen"
          @link="dialogData = { caption: 'Kitchen', type: AreaType.Kitchen }; open = true"
          @unlink="dialogTerminalRef = kitchenTerminal?.ref ?? null; openDelete = true;"
          @update:enabled="handleUpdate(AreaType.Kitchen, $event, undefined)"
          @update:categories="handleUpdate(AreaType.Kitchen, undefined, $event)"
        />

        <AreaCard
          :active-categories="areasStore.areas.bar.categories"
          :categories="menuItemsStore.categories()"
          :connection="barTerminal?.connection ?? null"
          :enabled="areasStore.areas.bar.enabled"
          :icon="GlassWater"
          :linked="barTerminal !== null"
          caption="Bar"
          @link="dialogData = { caption: 'Bar', type: AreaType.Bar }; open = true"
          @unlink="dialogTerminalRef = barTerminal?.ref ?? null; openDelete = true;"
          @update:enabled="handleUpdate(AreaType.Bar, $event, undefined)"
          @update:categories="handleUpdate(AreaType.Bar, undefined, $event)"
        />

        <LinkTerminalDialog
          :open="open"
          :title="`Link ${dialogData?.caption.toLowerCase()} terminal`"
          @submit="handleLink($event)"
          @update:open="open = $event"
        />
      </div>
    </Section>

    <AlertDialog :open="openDelete" @update:open="openDelete = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you really want to unlink this terminal?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="dialogTerminalRef !== null && handleUnlink(dialogTerminalRef)">
            Unlink
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </Container>
</template>
