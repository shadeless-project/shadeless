import mongoose, { Document, Schema, Types } from 'mongoose';

export class IncommingPacket {
  requestPacketId: string;
  toolName: string;
  method: string;
  requestLength: number;
  requestHttpVersion: string;
  requestContentType: string;
  referer: string;
  protocol: string;
  origin: string;
  port: number;
  path: string;
  hasBodyParam: boolean;
  querystring: string;
  requestBodyHash: string;
  parameters: string[];
  requestHeaders: string[];
  requestCookies: string;

  responseStatus: number;
  responseContentType: string;
  responseStatusText: string;
  responseLength: number;
  responseMimeType: string;
  responseHttpVersion: string;
  responseInferredMimeType: string;
  responseCookies: string;
  responseBodyHash: string;
  responseHeaders: string[];
  rtt: number;
  reflectedParameters: Record<string, string>;

  project: string;
  codeName: string;
  staticScore: number;
  hash: string;
}

export enum ItemStatus {
  TODO = 'todo',
  SCANNING = 'scanning',
  DONE = 'done',
}

export class RawPacket extends IncommingPacket {
  requestPacketIndex: number;
  requestPacketPrefix: string;
  _id?: Types.ObjectId;
}
export interface RawPacketDocument extends RawPacket, Document {
  _id: Types.ObjectId;
}

export const RawPacketSchema = new Schema<RawPacketDocument>(
  {
    requestPacketId: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    requestPacketIndex: { type: Schema.Types.Number, required: true },
    requestPacketPrefix: { type: Schema.Types.String, required: true },
    requestHttpVersion: { type: Schema.Types.String, default: '' },
    toolName: { type: Schema.Types.String, default: '' },
    method: { type: Schema.Types.String, required: true },
    requestLength: { type: Schema.Types.Number, default: 0 },
    requestContentType: { type: Schema.Types.String, default: '' },
    referer: { type: Schema.Types.String, default: '' },
    protocol: { type: Schema.Types.String, default: '' },
    origin: { type: Schema.Types.String, required: true },
    port: { type: Schema.Types.Number },
    path: { type: Schema.Types.String, required: true },
    hasBodyParam: { type: Schema.Types.Boolean },
    querystring: { type: Schema.Types.String, default: '' },
    requestBodyHash: { type: Schema.Types.String, required: true },
    parameters: { type: [Schema.Types.String], default: [] },
    requestHeaders: { type: [Schema.Types.String], default: [] },
    requestCookies: { type: Schema.Types.String, default: '' },

    responseStatus: { type: Schema.Types.Number, default: 0 },
    responseContentType: { type: Schema.Types.String, default: '' },
    responseStatusText: { type: Schema.Types.String, default: '' },
    responseLength: { type: Schema.Types.Number, default: 0 },
    responseMimeType: { type: Schema.Types.String, default: '' },
    responseHttpVersion: { type: Schema.Types.String, default: '' },
    responseInferredMimeType: { type: Schema.Types.String, default: '' },
    responseCookies: { type: Schema.Types.String, default: '' },
    responseBodyHash: { type: Schema.Types.String, required: true },
    responseHeaders: { type: [Schema.Types.String], default: [] },
    rtt: { type: Schema.Types.Number, default: 0 },
    reflectedParameters: {
      type: Schema.Types.Mixed,
      default: {},
      required: true,
    },

    staticScore: { type: Schema.Types.Number, required: true },
    project: { type: Schema.Types.String, required: true },
    codeName: { type: Schema.Types.String, required: true },
    hash: { type: Schema.Types.String, required: true },
  },
  { timestamps: true },
);

RawPacketSchema.index({ requestPacketId: 1, project: 1 }, { unique: true });

export default mongoose.model<RawPacketDocument>(
  'rawpackets',
  RawPacketSchema,
  'rawpackets',
);
