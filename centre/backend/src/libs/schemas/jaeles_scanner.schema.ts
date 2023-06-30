import mongoose, { Document, Schema, Types } from 'mongoose';

export class JaelesScanner {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  scanKeyword: string;
}
export interface JaelesScannerDocument extends JaelesScanner, Document {
  _id: Types.ObjectId;
}

export const JaelesScannerSchema = new Schema<JaelesScanner>(
  {
    name: { type: Schema.Types.String, required: true, unique: true },
    description: { type: Schema.Types.String, required: true },
    scanKeyword: { type: Schema.Types.String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<JaelesScannerDocument>(
  'jaeles_scanner',
  JaelesScannerSchema,
  'jaeles_scanner',
);
