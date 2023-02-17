import { Injectable } from '@nestjs/common';
import path from 'path';
import fs from 'fs/promises';
import { UploadFileDto } from '../burp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from 'libs/schemas/file.schema';
import { Model } from 'mongoose';
import mv from 'mv';

async function mvAsync(src: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mv(src, dest, function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

@Injectable()
export class BurpFileService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async handleFileUpload(body: UploadFileDto, file: Express.Multer.File) {
    const newObj = {
      fileId: body.id,
      project: body.project,
    };
    const fileObject = await this.fileModel.findOne(newObj);
    if (!fileObject) {
      await fs.mkdir(path.join('/files', body.project), { recursive: true });
      try {
        await mvAsync(file.path, path.join('/files', body.project, body.id));
      } catch (err) {
        console.log(err);
      }
      await this.fileModel.create(newObj);
    }
  }
}
