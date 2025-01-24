import { defineStore } from "pinia";
import { AreaType, type MappedAPI } from "webrm-shared";


export type Areas = MappedAPI["GET /areas"]["output"]["areas"];

interface State {
  areas: Areas;
}

export const useAreasStore = defineStore("areas", {
  state: (): State => ({
    areas: {
      [AreaType.Kitchen]: {
        type: AreaType.Kitchen,
        enabled: false,
        categories: [],
      },
      [AreaType.Bar]: {
        type: AreaType.Bar,
        enabled: false,
        categories: [],
      },
    },
  }),
  actions: {
    setAreas(areas: Areas) {
      this.areas = areas;
    },
    updateArea(area: Areas[keyof Areas]) {
      this.areas[area.type] = area;
    },
  },
});
