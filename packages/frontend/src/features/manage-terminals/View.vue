<script lang="ts" setup>
import { Computer } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { TerminalType } from "webrm-shared";
import { api } from "~/api";
import { Container, Section } from "~/components/base";
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
import { Empty } from "~/components/util";
import TerminalCard from "~/features/manage-terminals/components/TerminalCard.vue";
import { useTerminalsStore } from "~/stores/terminals";
import { getErrorMessage } from "~/utils/error";


// Stores
const terminalsStore = useTerminalsStore();

// State
const loading = ref(true);
const open = ref(false);
const dialogTerminalRef = ref<string | null>(null);

// Computed
const groups = computed(() => {
  const groups = Object.groupBy(terminalsStore.terminals, (terminal) => {
    switch (terminal.ref) {
    case `${TerminalType.Kitchen}`:
    case `${TerminalType.Bar}`:
      return "area";
    default:
      return "table";
    }
  });

  if (typeof groups.area != "undefined") {
    groups.area = groups.area.toSorted((a, b) => b.ref.localeCompare(a.ref));
  }

  if (typeof groups.table != "undefined") {
    groups.table = groups.table.toSorted((a, b) => {
      if (typeof a.name == "undefined") {
        return -1;
      }
      if (typeof b.name == "undefined") {
        return 1;
      }

      return a.name.localeCompare(
        b.name,
        undefined,
        { numeric: true, sensitivity: "base" },
      );
    });
  }

  return groups;
});

onMounted(async () => {
  try {
    const terminals = await api("GET /terminals", {});

    terminalsStore.mergeTerminals(terminals);
    loading.value = false;
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});

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
    <Section :loading="loading" title="Terminals">
      <Empty
        v-if="terminalsStore.terminals.length == 0"
        :icon="Computer"
        caption="No terminals linked"
      />

      <template v-else>
        <div class="flex flex-col gap-8">
          <div v-if="(groups.area?.length ?? 0) > 0" class="flex flex-col gap-4">
            <div class="sticky top-0 -mx-10 px-10 bg-gray-100">
              <h2 class="py-2 text-3xl font-normal border-b">Restaurant</h2>
            </div>

            <div class="grid grid-cols-3 gap-8">
              <TerminalCard
                v-for="terminal in groups.area"
                :key="terminal.id"
                :connection="terminal.connection"
                :name="terminal.name"
                :reference="terminal.ref as never"
                @unlink="dialogTerminalRef = terminal.ref; open = true"
              />
            </div>
          </div>

          <div v-if="(groups.table?.length ?? 0) > 0" class="flex flex-col gap-4">
            <div class="sticky top-0 -mx-10 px-10 bg-gray-100">
              <h2 class="py-2 text-3xl font-normal border-b">Tables</h2>
            </div>

            <div class="grid grid-cols-3 gap-8">
              <TerminalCard
                v-for="terminal in groups.table"
                :key="terminal.id"
                :connection="terminal.connection"
                :name="terminal.name"
                :reference="terminal.ref as never"
                @unlink="dialogTerminalRef = terminal.ref; open = true"
              />
            </div>
          </div>
        </div>
      </template>
    </Section>

    <AlertDialog :open="open" @update:open="open = $event">
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
