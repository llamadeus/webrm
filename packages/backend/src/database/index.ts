import mongoose from "mongoose";


export function connect(url: string) {
  return mongoose.connect(url, {
    authSource: "admin",
  });
}
