import dayjs from 'dayjs';

import db from '../../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

export default async (c: Context) => {
  const userId = c.req.param('userId')
  const notificationId = c.req.param('notificationId')
  const includeDeleted = c.req.query('includeDeleted') === 'true';

  let dbFindOptions: Prisma.UserNotificationFindUniqueArgs = {
    where: {
      id: notificationId
  } }
  if (!includeDeleted) {
    dbFindOptions.where = {
      userId: userId,
      id: notificationId,
      deletedAt: null
    }
  } else {
    dbFindOptions.where = {
      userId: userId,
      id: notificationId
    }
  }
  const notifications = await db.userNotification.findUnique(dbFindOptions);

  return c.json(notifications)
}