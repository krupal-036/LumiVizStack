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
    validate: {
      validator: function (v) {
        const lineCount = JSON.stringify(v, null, 2).split('\n').length;
        return lineCount <= 500;
      },
      message: props => `The data object exceeds 500 lines.`
    }
  },
  rawInput: {
    type: String,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return v.trim().split('\n').length <= 500;
      },
      message: "The raw input text exceeds 500 lines."
    }
  },
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
