import type { SyncEvent } from "webrm-shared";


type HandlerFn<T extends SyncEvent> = (event: T) => void;

interface Handler<T extends SyncEvent> {
  type: T["type"];
  handler: HandlerFn<T>;
}

export function handler<Key extends SyncEvent["type"]>(
  type: Key,
  handler: HandlerFn<SyncEvent & { type: Key }>,
): Handler<SyncEvent> {
  return {
    type,
    handler,
  } as Handler<SyncEvent>;
}
