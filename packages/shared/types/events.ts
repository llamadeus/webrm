import { AreaType, OrderStatus } from "./general";


export type SyncEvent =
  | TableCreated
  | TableDeleted
  | MenuItemCreated
  | MenuItemDeleted
  | WaiterCreated
  | WaiterDeleted
  | AreaUpdated
  | TerminalLinked
  | TerminalUpdated
  | TerminalUnlinked
  | OrdersCreated
  | OrderUpdated
  | OrderDeleted;

export interface TableCreated {
  type: "table-created";
  data: {
    id: string,
    name: string,
    createdAt: string,
  };
}

export interface TableDeleted {
  type: "table-deleted";
  data: {
    id: string,
  };
}

export interface MenuItemCreated {
  type: "menu-item-created";
  data: {
    id: string,
    name: string,
    category: string,
    price: number,
    createdAt: string,
  };
}

export interface MenuItemDeleted {
  type: "menu-item-deleted";
  data: {
    id: string,
  };
}

export interface WaiterCreated {
  type: "waiter-created";
  data: {
    id: string,
    name: string,
    email: string,
    lastLogin: string,
    createdAt: string,
  };
}

export interface WaiterDeleted {
  type: "waiter-deleted";
  data: {
    id: string,
  };
}

export interface AreaUpdated {
  type: "area-updated";
  data: {
    type: AreaType,
    enabled: boolean,
    categories: string[],
  };
}

export interface TerminalLinked {
  type: "terminal-linked";
  data: {
    id: string,
    ref: string,
    connection: {
      ip: string,
      lastSeen: string,
    } | null,
  };
}

export interface TerminalUpdated {
  type: "terminal-updated";
  data: {
    id: string,
    connection: {
      ip: string,
      lastSeen: string,
    } | null,
  };
}

export interface TerminalUnlinked {
  type: "terminal-unlinked";
  data: {
    id: string,
  };
}

export interface OrdersCreated {
  type: "orders-created";
  data: Array<{
    id: string,
    quantity: number,
    table: {
      id: string,
      name: string,
    },
    menuItem: {
      id: string,
      name: string,
      category: string,
      price: number,
    },
    status: OrderStatus,
  }>;
}

export interface OrderUpdated {
  type: "order-updated";
  data: {
    id: string,
    status: OrderStatus,
  };
}

export interface OrderDeleted {
  type: "order-deleted";
  data: {
    id: string,
  };
}
