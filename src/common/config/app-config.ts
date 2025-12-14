import 'dotenv/config';

export const config = () => ({
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtExpiresIn: parseInt(process.env.TOKEN_EXPIRE_TIME || '4800', 10),
});
