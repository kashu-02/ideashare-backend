import dayjs from 'dayjs';

import db from '../../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

export default async (c: Context) => {
  const newsId = c.req.param('newsId')
  const includeDeleted = c.req.query('includeDeleted') === 'true';

  let dbFindOptions: Prisma.NewsFindUniqueArgs = {
    where: {
      id: newsId
  } }
  if (!includeDeleted) {
    dbFindOptions.where = {
      id: newsId,
      deletedAt: null
    }
  }
  const notifications = await db.news.findUnique(dbFindOptions);

  return c.json(notifications)
}