import { BadRequestException, Injectable } from '@nestjs/common';
import fs from 'fs/promises';
import path from 'path';

@Injectable()
export class JaelesSignatureService {
  async getSignatureFiles() {
    const signatureLocation =
      process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
    const files = await fs.readdir(
      path.join(process.cwd(), 'signatures', signatureLocation),
    );
    return files.filter((fileName) => fileName.match(/\.(yaml|yml)$/));
  }

  async getOneSignatureFile(fileName: string) {
    const signatureLocation =
      process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
    const filePath = path.join(
      process.cwd(),
      'signatures',
      signatureLocation,
      fileName,
    );

    try {
      await fs.access(filePath);
    } catch {
      throw new BadRequestException('{}', 'Wrong fileName');
    }

    const f = await fs.readFile(filePath, 'utf-8');
    return f;
  }
}
