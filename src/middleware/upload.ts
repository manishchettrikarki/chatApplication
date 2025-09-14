import multer from "multer";
import path from "path";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import { currentEnvironment, s3Variables } from "../utils/constants";

const isProduction = currentEnvironment;

const s3 = new AWS.S3({
  accessKeyId: s3Variables.accessKeyId,
  secretAccessKey: s3Variables.secretAccessKey,
  region: s3Variables.region,
});

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const s3Storage = multerS3({
  s3,
  bucket: s3Variables.bucketName!,
  acl: "public-read",
  key: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

export const upload = multer({
  storage: isProduction ? s3Storage : localStorage,
});
