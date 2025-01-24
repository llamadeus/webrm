import { useTablesStore } from "~/stores/tables";
import { handler } from "~/sync/utils";


export const handleTableCreated = handler("table-created", (event) => {
  const tablesStore = useTablesStore();

  tablesStore.addTable(event.data);
});
