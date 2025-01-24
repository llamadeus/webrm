<script lang="ts" setup>
import { MoreVertical, Square, SquareCheck } from "lucide-vue-next";
import { computed, type FunctionalComponent } from "vue";
import { type Connection } from "webrm-shared";
import { CallToAction } from "~/components/card";
import { ConnectionDetails } from "~/components/terminal";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { BadgeGroup } from "~/components/util";
import { cn } from "~/lib/utils";
import { pluralize } from "~/utils/plural";


const props = defineProps<{
  caption: string,
  icon: FunctionalComponent,
  enabled: boolean,
  categories: string[],
  activeCategories: string[],
  linked: boolean,
  connection: Connection | null,
}>();

const emit = defineEmits<{
  (e: "link"): void,
  (e: "unlink"): void,
  (e: "update:enabled", enabled: boolean): void,
  (e: "update:categories", categories: string[]): void,
}>();

const activeCategories = computed(() => (
  props.activeCategories.filter((category) => props.categories.includes(category))
));

function isActive(category: string): boolean {
  return activeCategories.value.includes(category);
}

function handleCategoryClick(category: string) {
  const next = activeCategories.value.includes(category)
    ? activeCategories.value.filter((c) => c !== category)
    : [...activeCategories.value, category];

  emit("update:categories", next);
}
</script>

<template>
  <Card class="flex flex-col h-fit">
    <CardHeader class="h-8 box-content flex flex-row items-center gap-3">
      <CardTitle :class="cn('text-xl transition-colors', !props.enabled && 'text-foreground/20')">
        <component :is="props.icon"/>
        {{ props.caption }}
      </CardTitle>

      <DropdownMenu v-if="props.enabled">
        <DropdownMenuTrigger as-child>
          <Button size="icon" variant="ghost">
            <MoreVertical/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <template v-if="props.linked">
            <DropdownMenuItem as-child @click="emit('unlink')">
              <button>Unlink terminal</button>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
          </template>
          <DropdownMenuItem as-child variant="destructive" @click="emit('update:enabled', false)">
            <button>Disable</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>

    <CardContent class="grid grid-cols-[1fr] transition-all">
      <div class="overflow-hidden">

        <div v-if="props.enabled" class="flex flex-col gap-6">
          <div class="flex gap-2 justify-between">
            <BadgeGroup>
              <Badge variant="default">enabled</Badge>
              <Badge v-if="props.linked">linked</Badge>
              <Badge v-else variant="secondary">unlinked</Badge>
              <template v-if="props.linked">
                <Badge v-if="props.connection !== null" variant="success">connected</Badge>
                <Badge v-else variant="destructive">disconnected</Badge>
              </template>
            </BadgeGroup>
            <Badge variant="secondary">{{ pluralize("category", activeCategories.length) }}</Badge>
          </div>

          <ConnectionDetails v-if="props.linked" :connection="props.connection"/>
          <CallToAction v-else description="This area is currently not linked to any terminal">
            <Button class="self-center" variant="default" @click="emit('link')">
              Link terminal
            </Button>
          </CallToAction>

          <hr/>

          <CallToAction description="Select categories to receive live orders for">
            <div class="columns-2 lg:columns-1 xl:columns-2 gap-2 space-y-2">
              <button
                v-for="(category, index) in props.categories"
                :key="index"
                :class="cn(
                'flex w-full pl-3 pr-2 py-1.5 rounded-md bg-gray-100 gap-1 transition-colors',
                isActive(category) && 'bg-primary text-primary-foreground',
              )"
                @click="handleCategoryClick(category)"
              >
                <span class="flex-1 text-left">{{ category }}</span>

                <div class="grid grid-stack">
                  <SquareCheck :class="cn('scale-0 transition-transform', isActive(category) && 'scale-100')"/>
                  <Square :class="cn('scale-0 transition-transform', !isActive(category) && 'scale-100')"/>
                </div>
              </button>
            </div>
          </CallToAction>
        </div>

        <CallToAction v-else description="This area is currently not enabled">
          <Button class="self-center" variant="default" @click="emit('update:enabled', true)">
            Enable
          </Button>
        </CallToAction>
      </div>
    </CardContent>
  </Card>
</template>
