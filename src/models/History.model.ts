import mongoose, { Schema, Document, Model, model } from "mongoose";
import crypto from "crypto";

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  isPublic: boolean;
  title: string;
  type: string;
  data: any;
  rawInput?: string;
  urlInput?: string;
  inputType?: string;
  isDeleted: boolean;
  shareId?: string;
  createdAt: Date;
}

const historySchema = new Schema<IHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "User",
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
        validator: function (v: any): boolean {
          const lineCount = JSON.stringify(v, null, 2).split("\n").length;
          return lineCount <= 500;
        },
        message: (props: any) => `The data object exceeds 500 lines.`,
      },
    },
    rawInput: {
      type: String,
      validate: {
        validator: function (v: string | undefined): boolean {
          if (!v) return true;
          return v.trim().split("\n").length <= 500;
        },
        message: "The raw input text exceeds 500 lines.",
      },
    },
    urlInput: String,
    inputType: String,
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true,
      default: (): string => crypto.randomBytes(6).toString("hex"),
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false },
);

const History: Model<IHistory> =
  (mongoose.models.History as Model<IHistory>) || model<IHistory>("History", historySchema);

export default History;
