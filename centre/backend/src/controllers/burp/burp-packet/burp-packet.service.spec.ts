import { Test, TestingModule } from '@nestjs/testing';
import { BurpPacketService } from './burp-packet.service';

describe('BurpPacketService', () => {
  let service: BurpPacketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BurpPacketService],
    }).compile();

    service = module.get<BurpPacketService>(BurpPacketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
