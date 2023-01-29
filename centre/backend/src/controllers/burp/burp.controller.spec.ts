import { Test, TestingModule } from '@nestjs/testing';
import { BurpController } from './burp.controller';

describe('BurpController', () => {
  let controller: BurpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BurpController],
    }).compile();

    controller = module.get<BurpController>(BurpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
