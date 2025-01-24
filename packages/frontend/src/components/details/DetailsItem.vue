<script lang="ts" setup>
const props = defineProps<{
  caption: string,
}>();
</script>

<template>
  <dt class="text-xs font-semibold uppercase [dd_+_&]:mt-3 mb-0.5">
    {{ props.caption }}
  </dt>

  <dd class="text-muted-foreground">
    <slot/>
  </dd>
</template>
