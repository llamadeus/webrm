import mongoose, { Document, Schema } from "mongoose";


export interface MenuItem extends Document {
  restaurantId: string;
  name: string;
  category: string;
  price: number;
  createdAt: Date;
}

const MenuItemSchema: Schema = new Schema<MenuItem>({
  restaurantId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const MenuItem = mongoose.model<MenuItem>("MenuItem", MenuItemSchema);
