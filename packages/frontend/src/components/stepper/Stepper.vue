<script lang="ts" setup>
import { Check } from "lucide-vue-next";
import { computed, type HTMLAttributes } from "vue";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";


type Key = string | number | symbol;

interface Step {
  key: Key;
  caption: string;
  completed?: boolean;
}

const props = defineProps<{
  active: Key;
  steps: Step[];
  class?: HTMLAttributes["class"],
}>();

const emits = defineEmits<{
  (event: "change", key: Key): void;
}>();

const cols = computed(() => props.steps.map(() => "1fr").join(" auto "));
const style = computed(() => `--chevron-strength: 1px; --chevron-aspect: 3/10; grid-template-columns: ${cols.value};`);

function handleClick(step: Step) {
  if (! step.completed) {
    return;
  }

  emits("change", step.key);
}
</script>

<template>
  <div :class="cn('grid rounded-md overflow-clip border', props.class)" :style="style">
    <template v-for="(step, index) in steps" :key="step.key">
      <div v-if="index > 0" class="chevron-border bg-border"/>

      <button
        :class="cn(
          'flex items-center gap-3 px-3 py-2 chevron-attachments transition-colors justify-center cursor-default',
          props.active === step.key && 'bg-gray-50',
          step.completed && 'cursor-pointer hover:bg-gray-100',
        )"
        type="button"
        @click="handleClick(step)"
      >
        <Badge
          :variant="step.completed ? 'default' : 'outline'"
          class="size-6 p-0 items-center justify-center rounded-full"
        >
          <template v-if="step.completed">
            <Check class="size-4"/>
          </template>
          <template v-else>
            {{ index + 1 }}
          </template>
        </Badge>
        {{ step.caption }}
      </button>
    </template>
  </div>
</template>
