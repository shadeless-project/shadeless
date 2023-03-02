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
  @MaxLength(1000)
  requestHttpVersion: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  requestContentType: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  referer: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  origin: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  port: number;

  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  path: string;

  @IsBoolean()
  @IsOptional()
  hasBodyParam: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
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
  @IsOptional()
  @MaxLength(10000)
  requestCookies: string;

  @IsNumber()
  @Min(0)
  @Max(2048)
  responseStatus: number;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  responseContentType: string;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  responseStatusText: string;

  @IsNumber()
  @Min(0)
  responseLength: number;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  responseMimeType: string;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  responseHttpVersion: string;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  responseInferredMimeType: string;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  responseCookies: string;

  @IsString()
  @Matches(/^[0-9a-f]{64}$/i)
  responseBodyHash: string;

  @IsArray()
  @IsString({ each: true })
  responseHeaders: string[];

  @IsNumber()
  @IsOptional()
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
  @MinLength(1)
  @MaxLength(128)
  project: string;
}
