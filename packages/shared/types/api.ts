import type { Api } from "webrm-backend/src/endpoints";


export type BackendApi = {
  [K in keyof Api as `${Api[K]["method"]} ${Api[K]["route"]}`]: Api[K];
}
