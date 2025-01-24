<script lang="ts" setup>
import { pluralize } from "@vitest/expect";
import dayjs from "dayjs";
import { io } from "socket.io-client";
import { onMounted, onUnmounted, ref } from "vue";
import { toast } from "vue-sonner";
import { api } from "~/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { getErrorMessage } from "~/utils/error";


interface Code {
  value: string;
  ttl: Date;
}

const PLACEHOLDER = "○";

const code = ref<Code | null>(null);
const remaining = ref<{ minutes: number; seconds: number } | null>({ minutes: 0, seconds: 0 });
const error = ref<string | null>(null);

let intervalId: number;

onMounted(() => {
  const socket = io(import.meta.env.VITE_BACKEND_URL);

  intervalId = setInterval(() => updateRemaining(), 500);

  socket.on("link-code", (data: Code) => {
    code.value = data;
    error.value = null;
    updateRemaining();
  });

  socket.on("linked", async (token: string) => {
    try {
      await api("POST /connect", {
        input: {
          token,
        },
      });

      window.location.reload();
    }
    catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  socket.on("disconnect", () => {
    error.value = "An error occurred. Please reload the page.";
  });
});

onUnmounted(() => {
  clearInterval(intervalId);
});

function updateRemaining() {
  if (code.value === null) {
    return;
  }

  const seconds = Math.max(0, dayjs(code.value.ttl).diff(dayjs(), "seconds"));
  const minutes = Math.round(seconds / 60);

  remaining.value = {
    minutes,
    seconds,
  };
}

function value(index: number) {
  return code.value?.value.at(index) ?? PLACEHOLDER;
}
</script>

<template>
  <div class="flex flex-col flex-1 items-center justify-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-xl">Link</CardTitle>
        <CardDescription>
          Enter the code below in your private admin area in <span class="font-serif italic text-blue-950">WebRM</span>
          to connect this terminal.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div :class="cn('flex gap-4 font-mono text-3xl justify-center', code === null && 'text-muted-foreground select-none')">
          <div class="flex">
            <span class="flex w-10 h-16 items-center justify-center border-y border-l rounded-l-md">
              {{ value(0) }}
            </span>
            <span class="flex w-10 h-16 items-center justify-center border-y border-l">
              {{ value(1) }}
            </span>
            <span class="flex w-10 h-16 items-center justify-center border-y border-x rounded-r-md">
              {{ value(2) }}
            </span>
          </div>

          <div class="flex">
            <span class="flex w-10 h-16 items-center justify-center border-y border-l rounded-l-md">
              {{ value(3) }}
            </span>
            <span class="flex w-10 h-16 items-center justify-center border-y border-l">
              {{ value(4) }}
            </span>
            <span class="flex w-10 h-16 items-center justify-center border-y border-x rounded-r-md">
              {{ value(5) }}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter class="justify-center">
        <p v-if="error === null" class="text-sm text-muted-foreground">
          This code is valid for
          <template v-if="remaining.seconds < 60">{{ pluralize("second", remaining.seconds) }}.</template>
          <template v-else>{{ pluralize("minute", remaining.minutes) }}.</template>
        </p>
        <p v-else class="text-sm text-destructive">
          {{ error }}
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
