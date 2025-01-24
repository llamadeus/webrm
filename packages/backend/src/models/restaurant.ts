import mongoose, { Document, Schema } from "mongoose";


export interface Restaurant extends Document {
  name: string;
  createdAt: Date;
}

const RestaurantSchema: Schema = new Schema<Restaurant>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Restaurant = mongoose.model<Restaurant>("Restaurant", RestaurantSchema);
