import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

export default async (c: Context) => {
  const includeDeleted = c.req.query('includeDeleted') === 'true';

  let dbFindOptions: Prisma.CatalogFindManyArgs = {}

  if (!includeDeleted) {
    dbFindOptions.where = {
      deletedAt: null
    }
  }
    
  const catalogs = await db.catalog.findMany(dbFindOptions);

  return c.json(catalogs)
}