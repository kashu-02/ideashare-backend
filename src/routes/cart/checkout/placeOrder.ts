import dayjs from 'dayjs';

import db from '../../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

type OrderItem = {
  catalogProductId: string;
  quantity: number;
}

type OrderBody = {
  userId: string;
  items: OrderItem[];
}

type FailedItems = {
  item: object;
  reason: string;
}[]

export default async (c: Context) => {
  const body: OrderBody = await c.req.json();

  let failedItems: FailedItems = []

  // Find product and get price.
  const transactionOutput = await db.$transaction(async(tx) => {
    const orderItems = await Promise.all(body.items.map((item) => {
      return tx.catalogProduct.findUnique({
        where: {
          id: item.catalogProductId,
          deletedAt: null
        }
      })
    }))

    //Verify items are available
    orderItems.forEach((item, index) => {
      if (item === null) {
        failedItems.push({
          item: body.items[index],
          reason: "この商品は削除されました。"
        })
      }
    })
    if (failedItems.length > 0) return {}

    const totalPrice = orderItems.reduce((acc, cur) => acc += cur!.price, 0)

    const orderItemsForPrisma: Prisma.OrderItemCreateWithoutOrderInput[] = orderItems.map((item,index) => {
      return {
        price: item!.price,
        quantity: body.items[index].quantity,
        CatalogProduct: {
          connect: {
            id: item!.id
          }
        }
      }
    })
    
    const order = await tx.order.create({
      data: {
        User: {
          connect: {
            id: body.userId
          }
        },
        total: totalPrice,
        OrderItems: {
          create: orderItemsForPrisma
        }
      }
    })
    return order
  })
  

  return c.json({
    successedItems: transactionOutput,
    failedItems
  })
}
