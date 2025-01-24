import type { API } from "webrm-backend/src/endpoints";


export type MappedAPI = {
  [K in keyof API as `${API[K]["method"]} ${API[K]["route"]}`]: API[K];
}
