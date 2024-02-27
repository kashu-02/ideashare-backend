import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

type CartItem = {
  catalogProductId: string;
  quantity: number;
}

type CartBody = {
  items: CartItem[];
}

type FailedItems = {
  catalogProductId: string;
  reason: string;
}[]

export default async (c: Context) => {
  const body: CartBody = await c.req.json();
  const userId = c.get('userId');
  let failedItems : FailedItems = []
  
  const cartItems = body.items.map((item) => {
    return {
      catalogProductId: item.catalogProductId,
      quantity: item.quantity
    }
  })

  // Find product and get price.
  const cartItemsPrice = await Promise.all(cartItems.map((item) =>
    db.catalogProduct.findUnique({
      where: {
        id: item.catalogProductId
      },
      select: {
        price: true,
      }
    })
  ))

  // Concat cart items with price
  const cartItemsWithPrice = cartItems.map((item, index) => {
    const price = cartItemsPrice[index]?.price
    if (!price) {
      failedItems.push({
        catalogProductId: item.catalogProductId,
        reason: "商品が見つかりませんでした。"
      })
      return null
    }
    return {
      catalogProductId: item.catalogProductId,
      price: price,
      quantity: item.quantity
    }
  }).filter(item => item)

  // Calculate total price
  const totalPrice = cartItemsPrice.reduce((acc, cur) => acc += cur?.price || 0, 0)

  const cartItemsForPrisma: Prisma.CartItemCreateWithoutCartInput[] = cartItemsWithPrice.map((item) => {
    return {
      price: item!.price,
      quantity: item!.quantity,
      CatalogProduct: {
        connect: {
          id: item!.catalogProductId
        }
      }
    }
  })
  const cart: Prisma.CartCreateInput = {
    total: totalPrice,
    CartItems: {
      create: cartItemsForPrisma
    },
    User: {
      connect: {
       id: userId
     }
   }
  }
  const createCart  = await db.cart.create({
    data: cart,
    include: {
      CartItems: {
        include: {
          CatalogProduct: true
        }
      }
    }
  })

  return c.json({
    successedItems: createCart,
    failedItems
  })
}
