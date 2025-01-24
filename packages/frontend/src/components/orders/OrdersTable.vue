<script lang="ts" setup>
import { ArrowRightToLine, Check, ClockAlert, Trash2 } from "lucide-vue-next";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import { OrderStatus } from "webrm-shared";
import { api } from "~/api";
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
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { RelativeTimestamp } from "~/components/util";
import { cn } from "~/lib/utils";
import type { Order } from "~/stores/orders";
import { getErrorMessage } from "~/utils/error";


const props = defineProps<{
  orders: Order[],
  hideTableColumn?: boolean;
  tableCaption?: string;
}>();

const open = ref(false);
const dialogOrderId = ref<string | null>(null);
const sorted = computed(() => props.orders.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt)));

async function handleUpdate(id: string, status: OrderStatus) {
  try {
    await api("PATCH /orders/:id", {
      params: {
        id,
      },
      input: {
        status,
      },
    });

    toast.success("Order updated");
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
}

async function handleDelete(id: string) {
  try {
    await api("DELETE /orders/:id", {
      params: {
        id,
      },
    });

    toast.success("Order deleted");
  }
  catch (error) {
    toast.error(getErrorMessage(error));
  }
}
</script>

<template>
  <Table>
    <TableCaption>{{ props.tableCaption ?? "A list of active orders." }}</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Ordered</TableHead>
        <TableHead v-if="!props.hideTableColumn">Table</TableHead>
        <TableHead>Item</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Status</TableHead>
        <TableHead/>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="order in sorted" :key="order.id">
        <TableCell>
          <RelativeTimestamp :timestamp="order.createdAt"/>
        </TableCell>
        <TableCell v-if="!props.hideTableColumn" class="font-semibold">{{ order.table.name }}</TableCell>
        <TableCell :class="cn(props.hideTableColumn && 'font-semibold')">{{ order.menuItem.name }}</TableCell>
        <TableCell class="text-right">{{ order.quantity }}</TableCell>
        <TableCell>
          <Badge v-if="order.status === OrderStatus.Pending" class="animate-pulse" variant="warning">pending</Badge>
          <Badge v-else-if="order.status === OrderStatus.Ready" variant="success">ready</Badge>
          <Badge v-else-if="order.status === OrderStatus.Delivered" variant="default">delivered</Badge>
        </TableCell>
        <TableCell>
          <div class="flex gap-2 justify-end">
            <div class="flex -space-x-px">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    :class="cn('rounded-md rounded-r-none', order.status === OrderStatus.Pending && 'bg-gray-300/50 shadow-inner')"
                    size="icon"
                    variant="outline"
                    @click="handleUpdate(order.id, OrderStatus.Pending)"
                  >
                    <ClockAlert/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mark as pending</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    :class="cn('rounded-none', order.status === OrderStatus.Ready && 'bg-gray-300/50 shadow-inner')"
                    size="icon"
                    variant="outline"
                    @click="handleUpdate(order.id, OrderStatus.Ready)"
                  >
                    <ArrowRightToLine/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mark as ready</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    :class="cn('rounded-md rounded-l-none', order.status === OrderStatus.Delivered && 'bg-gray-300/50 shadow-inner')"
                    size="icon"
                    variant="outline"
                    @click="handleUpdate(order.id, OrderStatus.Delivered)"
                  >
                    <Check/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mark as delivered</TooltipContent>
              </Tooltip>
            </div>

            <div class="flex">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    class="rounded-md"
                    size="icon"
                    variant="destructive"
                    @click="dialogOrderId = order.id; open = true"
                  >
                    <Trash2/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete order</TooltipContent>
              </Tooltip>

            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>

    <AlertDialog :open="open" @update:open="open = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you really want to delete this order?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="dialogOrderId !== null && handleDelete(dialogOrderId)">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </Table>
</template>
