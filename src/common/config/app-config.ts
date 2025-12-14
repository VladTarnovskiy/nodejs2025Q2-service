import 'dotenv/config';

export const config = () => ({
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtSecretRefresh: process.env.JWT_SECRET_REFRESH_KEY,
  jwtExpiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
  jwtExpiresInRefresh: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
  cryptSalt: parseInt(process.env.CRYPT_SALT || '10', 10),
});
