import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
};

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", userSchema);
