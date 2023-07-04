import { IsString, Matches, MaxLength } from 'class-validator';

export class TriggerScanDto {
  @IsString()
  @Matches(/^[a-f\d]{32}\.\d+$/i)
  requestPacketId: string;

  @IsString()
  @Matches(/^[\w-]{1,128}$/i)
  project: string;

  @IsString()
  @MaxLength(50)
  scannerId: string;
}
