import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    reply: { type: String, default: "" },
    status: { type: String, default: "Pending" },
    repliedAt: {type: Date, default: null}
  },
  { timestamps: true, collection: "contacts" }
);

const contactModel = mongoose.models.contact || mongoose.model("contact", contactSchema);

export default contactModel;
