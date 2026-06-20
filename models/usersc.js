import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Vinyl",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true },
);

UserSchema.virtual("CartCount").get(function () {
  if (!this.cart) return 0;
  return this.cart.reduce((total, item) => total + item.quantity, 0);
});

const User = mongoose.model("User", UserSchema);
export default User;
