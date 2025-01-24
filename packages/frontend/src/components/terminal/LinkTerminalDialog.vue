<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { PinInput, PinInputGroup, PinInputInput } from "~/components/ui/pin-input";


const props = defineProps<{
  title: string;
  open: boolean;
}>();

const emit = defineEmits<{
  (event: "submit", values: string, mode: "submit" | "keydown"): void;
  (event: "update:open", value: boolean): void;
}>();

const value = ref<string[]>([]);

watchEffect(() => {
  if (props.open) {
    value.value = [];
  }
});

watchEffect(() => {
  const clone: string[] = [...value.value];

  for (let i = 0; i < 6; i++) {
    if (typeof clone[i] != "undefined" && ! /[a-z0-9]/.test(clone[i])) {
      clone[i] = "";
    }
  }

  value.value = clone;
});

function handleKeydown(event: KeyboardEvent) {
  if (! /[a-z0-9]/.test(event.key)) {
    event.preventDefault();
  }
}

function handleComplete(mode: "submit" | "keydown") {
  const code = value.value.join("").trim();
  if (code.length !== 6) {
    return;
  }

  emit("submit", code, mode);
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
        <DialogDescription>
          Visit <code>/link</code> on your terminal and enter the shown code.
        </DialogDescription>
      </DialogHeader>

      <DialogBody>
        <PinInput
          v-model="value"
          class="justify-center"
          placeholder="○"
          @complete="handleComplete('keydown')"
          @keydown.enter="handleComplete('submit')"
        >
          <PinInputGroup class="flex gap-4">
            <div class="flex">
              <PinInputInput
                v-for="(id, index) in 3"
                :key="id"
                :index="index"
                class="w-10 h-16 font-mono text-3xl placeholder:scale-75"
                @keydown="handleKeydown"
              />
            </div>

            <div class="flex">
              <PinInputInput
                v-for="(id, index) in 3"
                :key="id"
                :index="index + 3"
                class="w-10 h-16 font-mono text-3xl placeholder:scale-75"
                @keydown="handleKeydown"
              />
            </div>
          </PinInputGroup>
        </PinInput>
      </DialogBody>

      <DialogFooter>
        <DialogClose as-child>
          <Button variant="ghost">
            Cancel
          </Button>
        </DialogClose>
        <Button variant="default" @click="handleComplete('submit')">
          Link
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
