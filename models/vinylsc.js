import mongoose from "mongoose";

const vinylSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true },
);

const Vinyl = mongoose.model("Vinyl", vinylSchema);
export default Vinyl;
