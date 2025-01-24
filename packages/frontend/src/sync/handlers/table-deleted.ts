import { useTablesStore } from "~/stores/tables";
import { handler } from "~/sync/utils";


export const handleTableDeleted = handler("table-deleted", (event) => {
  const tablesStore = useTablesStore();

  tablesStore.deleteTable(event.data.id);
});
