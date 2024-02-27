import dayjs from 'dayjs';

import db from '../../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

export default async (c: Context) => {
  const includeDeleted = c.req.query('includeDeleted') === 'true';

  let dbFindOptions: Prisma.NewsFindManyArgs = {}
  if (!includeDeleted) {
    dbFindOptions.where = {
      deletedAt: null
    }
  }
  const notifications = await db.news.findMany(dbFindOptions);

  return c.json(notifications)
}