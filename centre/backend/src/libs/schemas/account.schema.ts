import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export enum AccountRole {
  NORMAL = 'normal',
  ADMIN = 'admin',
}
export class Account {
  _id?: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  description: string;
  role: AccountRole;
}
export interface AccountDocument extends Account, Document {
  _id: Types.ObjectId;
  validatePassword: (data: string) => Promise<boolean>;
}

export const AccountSchema = new Schema<AccountDocument>(
  {
    username: { type: Schema.Types.String, required: true, unique: true },
    password: { type: Schema.Types.String, required: true },
    role: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, default: 'default@mail.com' },
    description: { type: Schema.Types.String, default: '' },
  },
  { timestamps: true },
);

export function hashBcrypt(s: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return reject(err);
      bcrypt.hash(s, salt, function (err, hash) {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  });
}
AccountSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    user.password = await hashBcrypt(user.password);
    next();
  } catch (err) {
    next(err);
  }
});

AccountSchema.methods.validatePassword = async function validatePassword(
  data: string,
) {
  return bcrypt.compare(data, this.password);
};

export default mongoose.model<AccountDocument>(
  'accounts',
  AccountSchema,
  'accounts',
);
