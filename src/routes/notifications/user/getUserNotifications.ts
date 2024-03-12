import dayjs from 'dayjs';

import db from '../../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

export default async (c: Context) => {
  const userId = c.get('userId');
  const includeDeleted = c.req.query('includeDeleted') === 'true';

  let dbFindOptions: Prisma.UserNotificationFindManyArgs = {}
  if (!includeDeleted) {
    dbFindOptions.where = {
      userId: userId,
      deletedAt: null
    }
  } else {
    dbFindOptions.where = {
      userId: userId
    }
  
  }
  const notifications = await db.userNotification.findMany(dbFindOptions);
  console.log(notifications)
  return c.json(notifications)
}