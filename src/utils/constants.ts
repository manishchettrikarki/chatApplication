export const dbConfig = {
  dbName: process.env.DB_DATABASE_NAME || "",
  dbUser: process.env.DB_USER || "",
  dbPassword: process.env.DB_PASSWORD || "",
};

export const appConfig = {
  port: process.env.PORT || "",
};

export const jwtSecrets = {
  jwtSecret: process.env.JWT_SECRET || "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  refreshExpiry: process.env.REFRESH_EXPIRES_IN || "",
  accessEXpiry: process.env.ACCESS_EXPIRES_IN || "",
};

export const s3Variables = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  region: process.env.AWS_REGION || "",
  bucketName: process.env.AWS_BUCKET_NAME,
};

export const currentEnvironment = process.env.CURRENT_ENVIRONMENT;
