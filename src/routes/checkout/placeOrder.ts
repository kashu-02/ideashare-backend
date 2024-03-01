import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';
import prisma from '../../infra/prisma';

type OrderItem = {
  catalogProductId: string;
  quantity: number;
}

type OrderBody = {
  name: string;
  address: string;
  items: OrderItem[];
}

type FailedItems = {
  item: object;
  reason: string;
}[]

export default async (c: Context) => {
  const userId = c.get('userId');
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
            id: userId
          }
        },
        name: body.name,
        address: body.address,
        OrderItems: {
          create: orderItemsForPrisma
        }
      }
    })

    if (failedItems.length === 0) { 
      await tx.cartItem.deleteMany({
        where: {
          userId
        }
      })
    }
    return order
  })
  

  return c.json({
    successedItems: transactionOutput,
    failedItems
  })
}
