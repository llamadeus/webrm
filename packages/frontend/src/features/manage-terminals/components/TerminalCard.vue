<script lang="ts" setup>
import { GlassWater, MoreVertical, RectangleVertical, Utensils } from "lucide-vue-next";
import { computed } from "vue";
import { type Connection, TerminalType } from "webrm-shared";
import { ConnectionDetails } from "~/components/terminal";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";


const props = defineProps<{
  reference: TerminalType.Kitchen | TerminalType.Bar | `${TerminalType.Table}:${string}`,
  name?: string,
  connection: Connection | null,
}>();

const emit = defineEmits<{
  (e: "unlink", ref: string): void;
}>();

const entity = computed(() => {
  const [type, id] = props.reference.toString().split(":");
  if (typeof type == "undefined") {
    throw new Error("Invalid terminal type");
  }

  return {
    type,
    id: id ?? null,
  };
});
</script>

<template>
  <Card class="flex flex-col">
    <CardHeader class="h-8 box-content flex flex-row items-center gap-3">
      <CardTitle>
        <template v-if="entity.type === TerminalType.Table">
          <RectangleVertical/>
          Table {{ props.name ?? "&lt;unknown&gt;" }}
        </template>
        <template v-else-if="entity.type === TerminalType.Kitchen">
          <Utensils/>
          Kitchen
        </template>
        <template v-else-if="entity.type === TerminalType.Bar">
          <GlassWater/>
          Bar
        </template>
      </CardTitle>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button size="icon" variant="ghost">
            <MoreVertical/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem as-child variant="destructive" @click="emit('unlink', props.reference)">
            <button>Unlink terminal</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>
    <CardContent class="flex flex-col flex-1 justify-center">
      <ConnectionDetails :connection="props.connection"/>
    </CardContent>
  </Card>
</template>
