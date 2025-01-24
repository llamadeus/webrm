import mongoose, { Document, Schema } from "mongoose";


export interface Table extends Document {
  restaurantId: string;
  name: string;
  createdAt: Date;
}

const TableSchema: Schema = new Schema<Table>({
  restaurantId: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Table = mongoose.model<Table>("Table", TableSchema);
