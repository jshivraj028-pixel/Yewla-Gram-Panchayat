import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'yewla_gram_panchayat_secure_jwt_secret_2026_key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};
