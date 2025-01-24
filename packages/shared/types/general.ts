export interface Auth {
  id: string;
  type: AuthType;
  restaurantId: string;
}

export enum AuthType {
  Admin = "admin",
  Waiter = "waiter",
  AreaTerminal = "area-terminal",
  TableTerminal = "table-terminal",
}

export enum TerminalType {
  Kitchen = "kitchen",
  Bar = "bar",
  Table = "table",
}

export enum AreaType {
  Kitchen = "kitchen",
  Bar = "bar",
}

export enum OrderStatus {
  Pending = "pending",
  Ready = "ready",
  Delivered = "delivered",
}

export interface Connection {
  ip: string;
  lastSeen: string;
}
