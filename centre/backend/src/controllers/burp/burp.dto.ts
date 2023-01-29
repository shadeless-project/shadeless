import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
  Matches,
  MinLength,
  IsOptional,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class UploadFileDto {
  constructor(project: string, id: string) {
    this.id = id;
    this.project = project;
  }

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  project: string;

  @IsString()
  @Matches(/^[0-9a-f]{64}$/i)
  id: string;
}

export class UploadPacketDto {
  @IsString()
  @Matches(/^[a-f\d]{32}\.\d+$/i)
  requestPacketId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(32)
  toolName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(16)
  method: string;

  @IsString()
  @MinLength(1)
  @MaxLength(16)
  protocol: string;

  @IsNumber()
  @Min(0)
  requestLength: number;

  @IsString()
  @MinLength(1)
  requestHttpVersion: string;

  @IsString()
  requestContentType: string;

  @IsString()
  referer: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  origin: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  port: number;

  // No Max length for path
  @IsString()
  @MinLength(1)
  path: string;

  @IsBoolean()
  hasBodyParam: boolean;

  @IsString()
  @IsOptional()
  querystring: string;

  @IsString()
  @Matches(/^[0-9a-f]{64}$/i)
  requestBodyHash: string;

  @IsArray()
  @IsString({ each: true })
  parameters: string[];

  @IsArray()
  @IsString({ each: true })
  requestHeaders: string[];

  @IsString()
  requestCookies: string;

  @IsNumber()
  @Min(0)
  @Max(2048)
  responseStatus: number;

  @IsString()
  responseContentType: string;

  @IsString()
  responseStatusText: string;

  @IsNumber()
  @Min(0)
  responseLength: number;

  @IsString()
  responseMimeType: string;

  @IsString()
  responseHttpVersion: string;

  @IsString()
  responseInferredMimeType: string;

  @IsString()
  responseCookies: string;

  @IsString()
  @Matches(/^[0-9a-f]{64}$/i)
  responseBodyHash: string;

  @IsArray()
  @IsString({ each: true })
  responseHeaders: string[];

  @IsNumber()
  rtt: number;

  @IsObject()
  reflectedParameters: Record<string, string>;

  @IsNumber()
  @Min(0)
  @Max(100)
  staticScore: number;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  codeName: string;

  @IsString()
  @Matches(/^[a-z0-9]{1,128}$/i)
  project: string;
}
