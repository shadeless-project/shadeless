import mongoose, { Document, Schema, Types } from 'mongoose';

export class File {
  _id?: Types.ObjectId;
  fileId: string;
  project: string;
}
export interface FileDocument extends File, Document {
  _id: Types.ObjectId;
}

export const FileSchema = new Schema<FileDocument>(
  {
    project: { type: Schema.Types.String, required: true },
    fileId: {
      type: Schema.Types.String,
      required: true,
      match: /^[0-9a-f]{64}$/i,
    },
  },
  { timestamps: true },
);

export default mongoose.model<FileDocument>('files', FileSchema, 'files');
