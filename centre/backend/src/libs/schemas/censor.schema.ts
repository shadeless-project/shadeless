import mongoose, { Document, Schema, Types } from 'mongoose';

export enum CensorType {
  ALL = 'all',
  ONE = 'one',
}
export class Censor {
  _id?: Types.ObjectId;
  project: string;
  type: CensorType;
  condition: any;
  description: string;
}
export interface CensorDocument extends Censor, Document {
  _id: Types.ObjectId;
}

export const CensorSchema = new Schema<CensorDocument>(
  {
    project: { type: Schema.Types.String },
    type: { type: Schema.Types.String, required: true },
    condition: {
      type: Schema.Types.Mixed,
      required: true,
    },
    description: { type: Schema.Types.String },
  },
  { timestamps: true },
);

export default mongoose.model<CensorDocument>(
  'censors',
  CensorSchema,
  'censors',
);
