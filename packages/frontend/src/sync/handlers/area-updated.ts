import { useAreasStore } from "~/stores/areas";
import { handler } from "~/sync/utils";


export const handleAreaUpdated = handler("area-updated", (event) => {
  const areasStore = useAreasStore();

  areasStore.updateArea(event.data);
});
