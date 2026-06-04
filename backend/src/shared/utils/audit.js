import { prisma } from '../prisma/client.js';

export async function writeAuditLog({
  userId = null,
  action,
  entity,
  entityId = null,
  details = null,
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
      },
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
}