<script lang="ts" setup>
import { MoreVertical, Users } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
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
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Empty, RelativeTimestamp } from "~/components/util";
import InviteWaiterDialog from "~/features/manage-waiters/components/InviteWaiterDialog.vue";
import { useWaitersStore } from "~/stores/waiters";
import { getErrorMessage } from "~/utils/error";


// Stores
const waitersStore = useWaitersStore();

// State
const loading = ref(true);
const open = ref(false);
const dialogWaiterId = ref<string | null>(null);

// Computed
const sorted = computed(() => waitersStore.waiters.toSorted((a, b) => a.name.localeCompare(b.name)));

onMounted(async () => {
  try {
    const waiters = await api("GET /waiters");

    waitersStore.setWaiters(waiters);
    loading.value = false;
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
});

async function handleDelete(id: string) {
  try {
    await api("DELETE /waiters/:id", {
      params: {
        id,
      },
    });

    toast.success("Waiter deleted");
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
}
</script>


<template>
  <Container>
    <Section :loading="loading" title="Waiters" with-card>
      <template #actions>
        <InviteWaiterDialog/>
      </template>

      <Empty
        v-if="waitersStore.waiters.length == 0"
        :icon="Users"
        caption="No waiters found"
      />

      <Table v-else>
        <TableCaption>A list of registered waiters.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="w-24">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Last login</TableHead>
            <TableHead>Registered at</TableHead>
            <TableHead/>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="waiter in sorted" :key="waiter.id">
            <TableCell>{{ waiter.id }}</TableCell>
            <TableCell class="font-semibold">{{ waiter.name }}</TableCell>
            <TableCell>
              <RelativeTimestamp :timestamp="waiter.lastLogin"/>
            </TableCell>
            <TableCell>
              <RelativeTimestamp :timestamp="waiter.createdAt"/>
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
                    as="button"
                    variant="destructive"
                    @click="dialogWaiterId = waiter.id; open = true"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <AlertDialog :open="open" @update:open="open = $event">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you really want to delete this waiter?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="dialogWaiterId !== null && handleDelete(dialogWaiterId)">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Section>
  </Container>
</template>
