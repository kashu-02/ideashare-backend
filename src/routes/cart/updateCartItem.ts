import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

type CartBody = {
  cartProductId: string;
  catalogProductId: string;
  quantity: number;
}

export default async (c: Context) => {
  const body: CartBody = await c.req.json();
  const userId = c.get('userId');

  console.log('body', body)
  console.log('userId', userId)
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

  if (body.quantity < 1) {
    await db.cartItem.delete({
      where: {
        id: body.cartProductId
      }
    })
  } else {
    await db.cartItem.update({
      where: {
        id: body.cartProductId
      },
      data: {
        quantity: body.quantity,
      }
    })
  }

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
