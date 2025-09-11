export const dbConfig = {
  dbName: process.env.DB_DATABASE_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
};

export const appConfig = {
  port: process.env.PORT,
};

export const jwtSecrets = {
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};
