import dayjs from 'dayjs';

import db from '../../../infra/prisma';

import type { Context } from 'hono';

export default async (c: Context) => {
  const prodcutId = c.req.param('productId')

  const product = await db.catalogProduct.findUnique({
    where: {
      id: prodcutId
    },
    include: {
      Company: true,
      Catalog: true,
      images: true
    }
  })


  return c.json(product)
}