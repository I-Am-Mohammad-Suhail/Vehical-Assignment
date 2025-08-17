import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, index: true },
    state: { type: String, required: true, index: true },
    vehicleType: { type: String, enum: ["2W","3W","4W"], required: true, index: true },
    manufacturer: { type: String, required: true, index: true },
    count: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

RegistrationSchema.index({ state: 1, date: 1 });
RegistrationSchema.index({ manufacturer: 1, date: 1 });

export default mongoose.model("Registration", RegistrationSchema);
