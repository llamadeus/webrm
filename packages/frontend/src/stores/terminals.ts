import { defineStore } from "pinia";
import type { BackendApi } from "webrm-shared";


export type Terminal = BackendApi["GET /terminals"]["output"][number];

interface State {
  terminals: Terminal[];
}

export const useTerminalsStore = defineStore("terminals", {
  state: (): State => ({
    terminals: [],
  }),
  actions: {
    getTerminal(ref: string) {
      return this.terminals.find((terminal: Terminal) => terminal.ref === ref) ?? null;
    },
    mergeTerminals(terminals: Terminal[], mode: "default" | "skip-missing" = "default") {
      const clone = [...this.terminals];
      const existing = Object.fromEntries(this.terminals.map((
        terminal: Terminal,
        index: number,
      ) => [terminal.id, index]));

      for (const terminal of terminals) {
        const index = existing[terminal.id];
        const old = clone[index];

        if (mode === "skip-missing" && typeof old == "undefined") {
          continue;
        }

        if (typeof old == "undefined") {
          clone.push(terminal);
        }
        else {
          clone[index] = {
            ...old,
            ...terminal,
          };
        }
      }

      this.terminals = clone;
    },
    deleteTerminal(id: string) {
      this.terminals = this.terminals.filter((terminal: Terminal) => terminal.id !== id);
    },
  },
});
