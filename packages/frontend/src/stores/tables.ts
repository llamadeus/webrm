import { defineStore } from "pinia";
import type { BackendApi } from "webrm-shared";


export type Table = BackendApi["GET /tables"]["output"]["tables"][number];

interface State {
  tables: Table[];
}

export const useTablesStore = defineStore("tables", {
  state: (): State => ({
    tables: [],
  }),
  getters: {
    sorted(state: State): Table[] {
      return state.tables.sort((a, b) => a.name.localeCompare(
        b.name,
        undefined,
        { numeric: true, sensitivity: "base" },
      ));
    },
  },
  actions: {
    setTables(tables: Table[]) {
      this.tables = tables;
    },
    addTable(table: Table) {
      this.tables.push(table);
    },
    deleteTable(id: string) {
      this.tables = this.tables.filter((table: Table) => table.id !== id);
    },
  },
});
