import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';

export default async (c: Context) => {
  const catalogId = c.req.param('catalogId');

  const catalog = await db.catalog.findUnique({
    where: {
      id: catalogId
    }
      });

  return c.json(catalog)
}