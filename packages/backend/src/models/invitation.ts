import mongoose, { Document, Schema } from "mongoose";


export interface Invitation extends Document {
  restaurantId: string;
  token: string;
  name: string;
  createdAt: Date;
}

const InvitationSchema: Schema = new Schema<Invitation>({
  restaurantId: { type: String, required: true },
  token: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Invitation = mongoose.model<Invitation>("Invitation", InvitationSchema);
