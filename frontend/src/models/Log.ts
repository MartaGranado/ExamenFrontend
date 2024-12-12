import{ Schema, model, models } from "mongoose";

const LogSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  email: { type: String, required: true },
  expiration: { type: Date, required: true },
  token: { type: String, required: true },
});

const Log = models.Log || model("Log", LogSchema);

export default Log;
