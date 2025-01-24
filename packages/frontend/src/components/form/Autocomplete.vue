<script lang="ts" setup>
import { PopoverAnchor, PopoverContent, PopoverPortal, PopoverRoot } from "radix-vue";
import { computed, ref, useAttrs, watchEffect } from "vue";
import { Input } from "~/components/ui/input";
import { Select, SelectItem } from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { fuzzy } from "~/utils/fuzzy";

// Define the prop and emit type
const props = defineProps<{
  modelValue?: string | number,
  options: string[],
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void
}>();
const attrs = useAttrs();

defineOptions({
  inheritAttrs: false,
});

const focused = ref(false);
const open = ref(false);
const selected = ref<string | number | undefined>(undefined);
const filtered = computed(() => {
  if (typeof props.modelValue == "undefined") {
    return props.options;
  }

  return fuzzy.filter(props.options, props.modelValue.toString()).map((result) => result.original);
});

watchEffect(() => {
  open.value = focused.value;
});

watchEffect(() => {
  if (! filtered.value.includes(selected.value)) {
    selected.value = undefined;
  }
});

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();

    const direction = event.key === "ArrowDown" ? 1 : -1;
    const index = typeof selected.value != "undefined"
      ? filtered.value.indexOf(selected.value) + direction
      : 0;
    const clamped = Math.max(0, Math.min(index, filtered.value.length - 1));

    selected.value = filtered.value[clamped];
  }
  else if (event.key === "Enter" && open.value) {
    event.preventDefault();

    if (typeof selected.value != "undefined") {
      open.value = false;
      emit("update:modelValue", selected.value);
    }
  }
  else if (event.key === "Escape" && open.value) {
    event.preventDefault();

    open.value = false;
  }
}
</script>

<template>
  <PopoverRoot :open="open">
    <PopoverAnchor class="flex">
      <Input
        :model-value="modelValue"
        v-bind="attrs"
        @blur="focused = false"
        @focus="focused = true"
        @keydown="handleKeyDown"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </PopoverAnchor>
    <PopoverPortal>
      <PopoverContent
        :class="cn(
          'relative z-50 max-h-96 min-w-32 w-[--radix-popper-anchor-width] overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        )"
      >
        <Select @update:model-value="emit('update:modelValue', $event); open = false">
          <div class="py-1">
            <div v-if="filtered.length == 0" class="py-1.5 px-3 text-center text-sm italic text-muted-foreground">
              No results
            </div>
            <SelectItem
              v-for="(option, index) in filtered"
              :key="index"
              :data-selected="option === selected ? true : undefined"
              :value="option"
              class="cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected]:bg-accent data-[selected]:text-accent-foreground"
              @pointermove.prevent
              @pointerleave.prevent
            >
              {{ option }}
            </SelectItem>
          </div>
        </Select>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
