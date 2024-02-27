import dayjs from 'dayjs';

import db from '../../../infra/prisma';

import type { Context } from 'hono';

type ProductBody = {
  catalogId: string;
  companyId: string;
  name: string;
  description?: string;
  price: number;
  imageIds: string[];
}

export default async (c: Context) => {
  const body: ProductBody = await c.req.json();

  const catalogProduct = await db.catalogProduct.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      Company: {
        connect: {
          id: body.companyId
        }
      },
      Catalog: {
        connect: {
          id: body.catalogId
        }
      },
      images: {
        connect: body.imageIds.map((id) => {
          return {
            id
          }
        })
      }
    }
  })

  return c.json(catalogProduct)
}
