import mongoose, { Document, Schema } from "mongoose";
import type { OrderStatus } from "webrm-shared";


export interface Order extends Document {
  restaurantId: string;
  tableId: string;
  tableName: string;
  menuItemId: string;
  menuItemName: string;
  menuItemCategory: string;
  menuItemPrice: number;
  quantity: number;
  status: OrderStatus;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema<Order>({
  restaurantId: { type: String, required: true },
  tableId: { type: String, required: true },
  tableName: { type: String, required: true },
  menuItemId: { type: String, required: true },
  menuItemName: { type: String, required: true },
  menuItemCategory: { type: String, required: true },
  menuItemPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<Order>("Order", OrderSchema);
