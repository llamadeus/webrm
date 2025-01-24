import mongoose, { Document, Schema } from "mongoose";


export enum UserRole {
  Admin = "ADMIN",
  Waiter = "WAITER",
}

export interface User extends Document {
  restaurantId: string;
  name?: string;
  role: UserRole;
  email: string;
  password: string;
  createdAt: Date;
  lastLogin: Date;
}

const UserSchema: Schema = new Schema<User>({
  restaurantId: { type: String, required: true },
  name: { type: String, required: false },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

export const User = mongoose.model<User>("User", UserSchema);
