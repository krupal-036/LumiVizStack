import mongoose from "mongoose";
import { vizHistoryConnection } from "../db.js";

const { Schema } = mongoose;

const HistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  rawInput: String,
  urlInput: String,
  inputType: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default vizHistoryConnection.model("History", HistorySchema);