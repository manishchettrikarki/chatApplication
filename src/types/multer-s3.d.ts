declare module "multer-s3" {
  import { Request } from "express";
  import { StorageEngine } from "multer";
  import { S3 } from "aws-sdk";

  interface MulterS3Options {
    s3: S3;
    bucket: string;
    acl?: string;
    key?: (
      req: Request,
      file: Express.Multer.File,
      cb: (err: any, key?: string) => void
    ) => void;
    metadata?: (
      req: Request,
      file: Express.Multer.File,
      cb: (err: any, metadata?: any) => void
    ) => void;
    contentType?: (
      req: Request,
      file: Express.Multer.File,
      cb: (err: any, mime?: string) => void
    ) => void;
  }

  function multerS3(options: MulterS3Options): StorageEngine;
  export = multerS3;
}
