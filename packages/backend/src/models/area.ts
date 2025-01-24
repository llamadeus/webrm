import mongoose, { Document, Schema } from "mongoose";
import type { AreaType } from "webrm-shared";


export interface RawArea {
  restaurantId: string;
  type: AreaType;
  enabled: boolean;
  categories: string[];
  createdAt: Date;
}

export interface Area extends Document, RawArea {
}

const AreaSchema: Schema = new Schema<Area>({
  restaurantId: { type: String, required: true },
  type: { type: String, required: true },
  enabled: { type: Boolean, default: false },
  categories: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Area = mongoose.model<Area>("Area", AreaSchema);
