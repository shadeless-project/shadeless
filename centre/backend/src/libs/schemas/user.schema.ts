import mongoose, { Document, Schema, Types } from 'mongoose';
import crypto from 'crypto';

export class User {
  _id?: Types.ObjectId;
  codeName: string;
  project: string;
  color: string;
}
export interface UserDocument extends User, Document {
  _id: Types.ObjectId;
}

export const UserSchema = new Schema<UserDocument>(
  {
    codeName: { type: Schema.Types.String, required: true },
    project: { type: Schema.Types.String, required: true },
    color: {
      type: Schema.Types.String,
      required: true,
      default: function () {
        return '#' + crypto.randomBytes(3).toString('hex');
      },
    },
  },
  { timestamps: true },
);

UserSchema.index({ project: 1, codeName: 1 }, { unique: true });

export default mongoose.model<UserDocument>('users', UserSchema, 'users');
