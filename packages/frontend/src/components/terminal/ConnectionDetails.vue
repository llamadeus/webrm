<script lang="ts" setup>
import { type Connection } from "webrm-shared";
import { CallToAction } from "~/components/card";
import { Details, DetailsItem } from "~/components/details";
import { RelativeTimestamp } from "~/components/util";


const props = defineProps<{
  connection: Connection | null,
}>();
</script>

<template>
  <Details v-if="props.connection">
    <DetailsItem caption="IP">{{ props.connection.ip }}</DetailsItem>
    <DetailsItem caption="Last Seen">
      <RelativeTimestamp :timestamp="props.connection.lastSeen"/>
    </DetailsItem>
  </Details>
  <CallToAction v-else description="Terminal is not connected."/>
</template>
