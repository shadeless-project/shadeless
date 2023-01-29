import mongoose, { Document, Schema, Types } from 'mongoose';

export enum ProjectStatus {
  TODO = 'todo',
  HACKING = 'hacking',
  DONE = 'done',
}

export class Project {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  status: ProjectStatus;
}
export interface ProjectDocument extends Project, Document {
  _id: Types.ObjectId;
}

export const ProjectSchema = new Schema<ProjectDocument>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      match: /^[\w-]{1,128}$/i,
    },
    description: { type: Schema.Types.String, default: '' },
    status: { type: Schema.Types.String, default: ProjectStatus.TODO },
  },
  { timestamps: true },
);

export default mongoose.model<ProjectDocument>(
  'project',
  ProjectSchema,
  'project',
);
