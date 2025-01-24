import mongoose, { Document, Schema } from "mongoose";
import type { TerminalType } from "webrm-shared";


export interface Terminal extends Document {
  restaurantId: string;
  ref: TerminalType.Kitchen | TerminalType.Bar | `${TerminalType.Table}:${string}`;
  name?: string;
  createdAt: Date;
}

const TerminalSchema: Schema = new Schema<Terminal>({
  restaurantId: { type: String, required: true },
  ref: { type: String, required: true },
  name: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

TerminalSchema.index({ restaurantId: 1, ref: 1 }, { unique: true });

export const Terminal = mongoose.model<Terminal>("Terminal", TerminalSchema);
