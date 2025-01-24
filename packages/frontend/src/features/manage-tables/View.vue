<script lang="ts" setup>
import dayjs from "dayjs";
import { LayoutDashboard, MoreVertical } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { TerminalType } from "webrm-shared";
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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { BadgeGroup, Empty, RelativeTimestamp } from "~/components/util";
import AddTableDialog from "~/features/manage-tables/components/AddTableDialog.vue";
import { useTablesStore } from "~/stores/tables";
import { useTerminalsStore } from "~/stores/terminals";
import { getErrorMessage } from "~/utils/error";


interface DialogData {
  id: string;
  name: string;
}

// Stores
const tablesStore = useTablesStore();
const terminalsStore = useTerminalsStore();

// State
const loading = ref(true);
const openLink = ref(false);
const dialogData = ref<DialogData | null>(null);
const openUnlink = ref(false);
const openDelete = ref(false);
const dialogTableId = ref<string | null>(null);

// Computed
const terminals = computed(() => {
  return new Map(
    terminalsStore.terminals
      .filter((terminal) => terminal.ref?.startsWith(`${TerminalType.Table}`))
      .map((terminal) => [terminal.ref, terminal]),
  );
});

onMounted(async () => {
  try {
    const response = await api("GET /tables", {});

    tablesStore.setTables(response.tables);
    terminalsStore.mergeTerminals(response.terminals);
    loading.value = false;
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});

function terminalRef(id: string) {
  return `${TerminalType.Table}:${id}`;
}

async function handleLink(code: string, mode: "submit" | "keydown") {
  if (dialogData.value === null) {
    return;
  }

  try {
    await api("POST /tables/:id/link", {
      params: {
        id: dialogData.value.id,
      },
      input: {
        code,
      },
    });

    toast.success("Terminal linked");
    openLink.value = false;
  }
  catch (error) {
    if (mode === "submit") {
      toast.error(getErrorMessage(error));
    }
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

async function handleDelete(id: string) {
  try {
    await api("DELETE /tables/:id", {
      params: {
        id,
      },
    });

    toast.success("Table deleted");
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
}
</script>

<template>
  <Container>
    <Section :loading="loading" title="Tables" with-card>
      <template #actions>
        <AddTableDialog/>
      </template>

      <Empty
        v-if="tablesStore.tables.length == 0"
        :icon="LayoutDashboard"
        caption="No tables found"
      />

      <Table v-else>
        <TableCaption>A list of tables in your restaurant.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="w-24">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead/>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="table in tablesStore.sorted" :key="table.id">
            <TableCell>{{ table.id }}</TableCell>
            <TableCell class="font-semibold">{{ table.name }}</TableCell>
            <TableCell>
              <BadgeGroup>
                <template v-if="terminals.has(terminalRef(table.id))">
                  <Badge variant="default">linked</Badge>
                  <Badge
                    v-if="(terminals.get(terminalRef(table.id))?.connection ?? null) === null"
                    variant="destructive"
                  >
                    disconnected
                  </Badge>
                  <Tooltip v-else>
                    <TooltipTrigger as-child>
                      <Badge variant="success">connected</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      last seen {{
                        dayjs(terminals.get(terminalRef(table.id))?.connection.lastSeen)
                          .format("HH:mm:ss on MMM DD YYYY")
                      }}
                    </TooltipContent>
                  </Tooltip>
                </template>
                <template v-else>
                  <Badge variant="secondary">unlinked</Badge>
                </template>
              </BadgeGroup>
            </TableCell>
            <TableCell>
              <RelativeTimestamp :timestamp="table.createdAt"/>
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
                    v-if="terminals.has(terminalRef(table.id))"
                    as="button"
                    @click="dialogTableId = table.id; openUnlink = true"
                  >
                    Unlink terminal
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    v-else
                    as="button"
                    @click="dialogData = { id: table.id, name: table.name }; openLink = true"
                  >
                    Link terminal
                  </DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem
                    as="button"
                    variant="destructive"
                    @click="dialogTableId = table.id; openDelete = true"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <LinkTerminalDialog
        :open="openLink"
        :title="`Link terminal to table ${dialogData?.name ?? 'unknown'}`"
        @submit="handleLink"
        @update:open="openLink = $event"
      />

      <AlertDialog :open="openUnlink" @update:open="openUnlink = $event">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you really want to unlink this terminal?</AlertDialogTitle>
            <AlertDialogDescription>
              The terminal will be logged out and will no longer receive any data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="dialogTableId !== null && handleUnlink(dialogTableId)">
              Unlink
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog :open="openDelete" @update:open="openDelete = $event">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you really want to delete this table?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="dialogTableId !== null && handleDelete(dialogTableId)">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Section>
  </Container>
</template>
