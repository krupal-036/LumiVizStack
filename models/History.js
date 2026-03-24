import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;

const HistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User'
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
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  shareId: {
    type: String,
    unique: true,
    sparse: true,
    default: () => crypto.randomBytes(6).toString('hex')
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const History = mongoose.models.History || mongoose.model("History", HistorySchema);

export default History;
