import mongoose, { Document, Schema, Types } from 'mongoose';
import { JaelesScanner } from './jaeles_scanner.schema';
import { Project } from './project.schema';
import { RawPacket } from './raw_packet.schema';

export class ScanRun {
  _id?: Types.ObjectId;
  scannerId: Types.ObjectId;
  project: string;
  requestPacketId: string;
}

export class ScanRunDetail {
  _id: Types.ObjectId;
  project: Project;
  scanner: JaelesScanner;
  packet: RawPacket;
}

export interface ScanRunDocument extends ScanRun, Document {
  _id: Types.ObjectId;
}

export const ScanRunSchema = new Schema<ScanRun>(
  {
    scannerId: { type: Schema.Types.ObjectId, required: true },
    project: { type: Schema.Types.String, required: true },
    requestPacketId: { type: Schema.Types.String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ScanRunDocument>(
  'scan_run',
  ScanRunSchema,
  'scan_run',
);
