import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  JaelesScanner,
  JaelesScannerDocument,
} from 'libs/schemas/jaeles_scanner.schema';
import { CreateJaelesScannerDto, EditJaelesScannerDto } from './jaeles.dto';

@Injectable()
export class JaelesScannerService {
  constructor(
    @InjectModel(JaelesScanner.name)
    private jaelesScannerModel: Model<JaelesScannerDocument>,
  ) {}

  async getScanners() {
    return this.jaelesScannerModel.find();
  }

  async createScanner(newScanner: CreateJaelesScannerDto) {
    const foundScanner = await this.jaelesScannerModel.findOne({
      name: newScanner.name,
    });
    if (foundScanner)
      throw new BadRequestException(
        '',
        `Already existed another scanner with name ${newScanner.name}`,
      );
    await this.jaelesScannerModel.create(newScanner);
    return 'Successfully create scanner';
  }

  async editScanner(id: string, data: EditJaelesScannerDto) {
    const edittingScanner = await this.jaelesScannerModel.findById(id);
    if (data.name && edittingScanner.name !== data.name) {
      const foundScanner = await this.jaelesScannerModel.findOne({
        name: data.name,
      });
      if (foundScanner)
        throw new BadRequestException(
          '',
          `Already existed another scanner with name ${data.name}`,
        );
    }
    await this.jaelesScannerModel.findByIdAndUpdate(id, {
      $set: data,
    });
    return 'Successfully edit scanner';
  }

  async deleteScanner(id: string) {
    await this.jaelesScannerModel.findByIdAndDelete(id);
    return 'Successfully delete scanner';
  }
}
