import { Test, TestingModule } from '@nestjs/testing';
import { BurpFileService } from './burp-file.service';

describe('BurpFileService', () => {
  let service: BurpFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BurpFileService],
    }).compile();

    service = module.get<BurpFileService>(BurpFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
