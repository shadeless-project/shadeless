import mongoose, { Document, Schema, Types } from 'mongoose';
import { ItemStatus } from './raw_packet.schema';

export class Path {
  _id?: Types.ObjectId;
  requestPacketId: string;
  origin: string;
  path: string;
  status: ItemStatus;
  project: string;
}
export interface PathDocument extends Path, Document {
  _id: Types.ObjectId;
}

export const PathSchema = new Schema<PathDocument>(
  {
    requestPacketId: { type: Schema.Types.String, required: true },
    origin: { type: Schema.Types.String, required: true },
    path: { type: Schema.Types.String, required: true },
    project: { type: Schema.Types.String, required: true },
  },
  { timestamps: true },
);

PathSchema.index({ project: 1, origin: 1, path: 1 }, { unique: true });

export default mongoose.model<PathDocument>('paths', PathSchema, 'paths');
