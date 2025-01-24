import { reactive, type Ref, ref } from "vue";

// Store all tab states with keys
const tabStates: Record<string | symbol, Ref<unknown>> = {};

// Get or create a global state for a given key
export function useGlobal<T>(key: string | symbol, initialValue: T): Ref<T> {
  let value = tabStates[key] as Ref<T> | undefined;

  if (typeof value == "undefined") {
    value = ref(initialValue) as Ref<T>;
    tabStates[key] = value;
  }

  return value;
}
