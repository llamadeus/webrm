import { useTerminalsStore } from "~/stores/terminals";
import { handler } from "~/sync/utils";


export const handleTerminalLinked = handler("terminal-linked", (event) => {
  const terminalsStore = useTerminalsStore();

  terminalsStore.mergeTerminals([event.data]);
});
