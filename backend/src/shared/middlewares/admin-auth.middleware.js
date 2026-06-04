import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client.js';
import { env } from '../../config/env.js';

export async function adminAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Токен администратора отсутствует',
      });
    }

    const token = authHeader.split(' ')[1];

    const payload = jwt.verify(token, env.ADMIN_JWT_SECRET);

    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.adminId },
      select: {
        id: true,
        login: true,
        createdAt: true,
      },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Администратор не найден',
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Недействительный токен администратора',
    });
  }
}