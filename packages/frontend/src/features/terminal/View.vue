<script lang="ts" setup>
import { AuthType } from "webrm-shared";
import AreaTerminal from "~/features/terminal/components/AreaTerminal.vue";
import TableTerminal from "~/features/terminal/components/TableTerminal.vue";
import { useAuthStore } from "~/stores/auth";


const authStore = useAuthStore();
</script>

<template>
  <AreaTerminal v-if="authStore.auth?.type === AuthType.AreaTerminal"/>
  <TableTerminal v-if="authStore.auth?.type === AuthType.TableTerminal"/>
</template>
