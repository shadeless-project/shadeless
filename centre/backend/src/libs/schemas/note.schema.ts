import mongoose, { Document, Schema, Types } from 'mongoose';

export class Note {
  _id?: Types.ObjectId;
  project: string;
  codeName: string;
  requestPacketId: string;
  tags: string;
  description: string;
}
export interface NoteDocument extends Note, Document {
  _id: Types.ObjectId;
}

export const NoteSchema = new Schema<NoteDocument>(
  {
    requestPacketId: { type: Schema.Types.String, required: true },
    project: { type: Schema.Types.String, required: true },
    codeName: { type: Schema.Types.String, required: true },
    tags: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<NoteDocument>('note', NoteSchema, 'note');
