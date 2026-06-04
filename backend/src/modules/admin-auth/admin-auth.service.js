import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/prisma/client.js';
import { env } from '../../config/env.js';

function createAdminToken(admin) {
  return jwt.sign(
    {
      adminId: admin.id,
      login: admin.login,
    },
    env.ADMIN_JWT_SECRET,
    {
      expiresIn: env.ADMIN_JWT_EXPIRES_IN,
    }
  );
}

export const adminAuthService = {
  async login({ login, password }) {
    if (!login || !password) {
      const error = new Error('Введите логин и пароль');
      error.statusCode = 400;
      throw error;
    }

    const admin = await prisma.adminUser.findUnique({
      where: { login },
    });

    if (!admin) {
      const error = new Error('Неверный логин или пароль');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      const error = new Error('Неверный логин или пароль');
      error.statusCode = 401;
      throw error;
    }

    const token = createAdminToken(admin);

    return {
      admin: {
        id: admin.id,
        login: admin.login,
        createdAt: admin.createdAt,
      },
      token,
    };
  },
};