import { Test, TestingModule } from '@nestjs/testing';
import { ProjectPacketsService } from './project-packets.service';

describe('ProjectPacketsService', () => {
  let service: ProjectPacketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectPacketsService],
    }).compile();

    service = module.get<ProjectPacketsService>(ProjectPacketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
