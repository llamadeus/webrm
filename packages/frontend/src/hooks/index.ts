import { onMounted, onUnmounted } from "vue";


export function useKeydownEvent(handler: (event: KeyboardEvent) => void) {
  onMounted(() => document.addEventListener("keydown", handler));
  onUnmounted(() => document.removeEventListener("keydown", handler));
}
