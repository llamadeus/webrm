<script lang="ts" setup>
import { FileCode } from "lucide-vue-next";
import { Empty } from "~/components/util/index.js";
</script>

<template>
  <Empty
    :icon="FileCode"
    action-caption="return to home"
    action-url="/"
    caption="Page not found"
    class="pt-36"
  />
</template>
