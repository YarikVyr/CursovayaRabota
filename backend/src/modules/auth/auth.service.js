import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/prisma/client.js';
import { env } from '../../config/env.js';

function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      login: user.login,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
}

export const authService = {
  async register({ fullName, login, password }) {
    if (!fullName || !login || !password) {
      const error = new Error('Заполните все обязательные поля');
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 8 || !/[a-zA-Z]/.test(password)) {
      const error = new Error('Пароль должен содержать минимум 8 символов и латинские буквы');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await prisma.user.findUnique({
      where: { login },
    });

    if (existingUser) {
      const error = new Error('Пользователь с таким логином уже существует');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        login,
        passwordHash,
      },
      select: {
        id: true,
        fullName: true,
        login: true,
        createdAt: true,
      },
    });

    const token = createToken(user);

    return {
      user,
      token,
    };
  },

  async login({ login, password }) {
    if (!login || !password) {
      const error = new Error('Введите логин и пароль');
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      const error = new Error('Неверный логин или пароль');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      const error = new Error('Неверный логин или пароль');
      error.statusCode = 401;
      throw error;
    }

    const token = createToken(user);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        login: user.login,
        createdAt: user.createdAt,
      },
      token,
    };
  },
};