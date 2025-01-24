<script lang="ts" setup>
import { computed } from "vue";


const props = defineProps<{
  price: number,
  noSmall?: boolean,
}>();

const euros = computed(() => Math.floor(props.price));
const cents = computed(() => Math.round((props.price - euros.value) * 100).toString().padStart(2, "0"));
</script>

<template>
  <template v-if="props.noSmall">
    {{ euros }}.{{ cents }}&nbsp;€
  </template>
  <template v-else>
    {{ euros }}.<span :style="{ fontSize: '0.75em' }">{{ cents }}</span>&nbsp;€
  </template>
</template>
