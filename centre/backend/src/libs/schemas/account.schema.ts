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
  },
  { timestamps: true },
);

AccountSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
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
