import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';

type CatalogBody = {
  name: string;
  price: number;
  imageUrl: string;
}

export default async (c: Context) => {
  const body: CatalogBody = await c.req.json();

  const catalog = await db.catalog.create({
    data: {
      name: body.name,
      price: body.price,
      imageUrl: body.imageUrl,
    }
  })
  
  return c.json(catalog)
}
