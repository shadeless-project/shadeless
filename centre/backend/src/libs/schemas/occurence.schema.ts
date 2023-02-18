import mongoose, { Document, Schema, Types } from 'mongoose';

export class Occurence {
  _id?: Types.ObjectId;
  hash: string; // Hash of rawPacket
  count: number;
}
export interface OccurenceDocument extends Occurence, Document {
  _id: Types.ObjectId;
}

export const OccurenceSchema = new Schema<OccurenceDocument>({
  hash: { type: Schema.Types.String, required: true },
  count: { type: Schema.Types.Number, default: 0, required: true },
});

OccurenceSchema.index({ hash: 1 }, { unique: true });
OccurenceSchema.index({ hash: 1 });

export default mongoose.model<OccurenceDocument>(
  'occurences',
  OccurenceSchema,
  'occurences',
);
