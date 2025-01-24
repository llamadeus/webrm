import { useTerminalsStore } from "~/stores/terminals";
import { handler } from "~/sync/utils";


export const handleTerminalUpdated = handler("terminal-updated", (event) => {
  const terminalsStore = useTerminalsStore();

  terminalsStore.mergeTerminals([event.data], "skip-missing");
});
