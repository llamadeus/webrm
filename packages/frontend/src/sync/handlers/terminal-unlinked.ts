import { useTerminalsStore } from "~/stores/terminals";
import { handler } from "~/sync/utils";


export const handleTerminalUnlinked = handler("terminal-unlinked", (event) => {
  const terminalsStore = useTerminalsStore();

  terminalsStore.deleteTerminal(event.data.id);
});
