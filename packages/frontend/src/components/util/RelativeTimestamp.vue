<script lang="ts" setup>
import dayjs from "dayjs";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";


defineProps<{
  timestamp: string,
}>();
</script>

<template>
  <Tooltip>
    <TooltipTrigger>
      <time :datetime="timestamp">{{ dayjs(timestamp).fromNow() }}</time>
    </TooltipTrigger>
    <TooltipContent>
      {{ dayjs(timestamp).format("HH:mm:ss on MMM DD YYYY") }}
    </TooltipContent>
  </Tooltip>
</template>
