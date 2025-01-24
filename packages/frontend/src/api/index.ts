import type { MappedAPI } from "webrm-shared";
import type { RouteParameters } from "~/types/express-serve-static-core";


type IsStrictlyAny<T> = (T extends never ? true : false) extends false ? false : true;

type InputOptions<Key extends keyof MappedAPI> = Key extends `GET ${infer _}`
  ? {}
  : IsStrictlyAny<MappedAPI[Key]["input"]> extends true
    ? {}
    : {
      input: MappedAPI[Key]["input"];
    };

type ParamsOptions<Key extends keyof MappedAPI> = {} extends RouteParameters<MappedAPI[Key]["route"]>
  ? {}
  : {
    params: RouteParameters<MappedAPI[Key]["route"]>,
  };

type Options<Key extends keyof MappedAPI> =
  & InputOptions<Key>
  & ParamsOptions<Key>;

export async function api<Key extends keyof MappedAPI & `GET ${string}`>(route: Key): Promise<MappedAPI[Key]["output"]>;
export async function api<Key extends keyof MappedAPI>(
  route: Key,
  options: Options<Key>,
): Promise<MappedAPI[Key]["output"]>;
export async function api<Key extends keyof MappedAPI>(
  route: Key,
  options?: Options<Key>,
): Promise<MappedAPI[Key]["output"]> {
  const [method, rawPath] = route.split(" ");
  const path = rawPath.replace(/(:(\w+))/g, (_1, _2, key) => {
    if (typeof options == "undefined") {
      throw new Error("Missing options");
    }

    if (! ("params" in options)) {
      throw new Error("Missing params");
    }

    if (typeof options.params[key] == "undefined") {
      throw new Error(`Missing param: ${key}`);
    }

    return options.params[key];
  });

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${path.replace(/^\//, "")}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: ["POST", "PUT", "PATCH", "DELETE"].includes(method) && typeof options != "undefined" && "input" in options
      ? JSON.stringify(options.input)
      : undefined,
  });
  const data = await response.json();

  if (! response.ok) {
    const message = typeof data == "object" && data !== null
      ? data.message
      : "Something went wrong";

    throw new Error(message);
  }

  return data;
}
