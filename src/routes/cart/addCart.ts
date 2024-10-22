import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

type CartBody = {
  catalogProductId: string;
  quantity: number;
}

export default async (c: Context) => {
  const body: CartBody = await c.req.json();
  const userId = c.get('userId');

  // Find product and get price.
  const cartItemsPrice = await db.catalogProduct.findUnique({
    where: {
      id: body.catalogProductId
    },
    select: {
      price: true,
    }
  })

  if (cartItemsPrice?.price === null) {
    return c.json({
      message: "商品が見つかりませんでした。"
    })
  }

  await db.cartItem.create({
    data: {
      userId: userId,
      catalogProductId: body.catalogProductId,
      quantity: body.quantity,
      price: cartItemsPrice!.price,
    }
  })

  const updatedCart = await db.cartItem.findMany({
    where: {
      userId: userId
    },
    include: {
      CatalogProduct: {
        include: {
          images: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  const totalPrice = updatedCart.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)


  return c.json({
    cartItems: updatedCart,
    totalPrice: totalPrice
  })
}
