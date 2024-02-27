import dayjs from 'dayjs';

import db from '../../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

export default async (c: Context) => {
  const catalogId = c.req.param('catalogId');
  const includeDeleted = c.req.query('includeDeleted') === 'true';

  let dbFindOptions: Prisma.CatalogProductFindManyArgs = {
    where: {
      catalogId
    },
    include: {
      images: true
    }
  }

  if (!includeDeleted) {
    dbFindOptions.where = {
      ...dbFindOptions.where,
      deletedAt: null
    }
  }

  const products = await db.catalogProduct.findMany(dbFindOptions);

  return c.json(products)
}