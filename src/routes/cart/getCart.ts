import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { CartItem, CatalogProduct, Prisma } from '@prisma/client';

type CartItemWithCatalogProduct = CartItem & {
  CatalogProduct: CatalogProduct
}
export default async (c: Context) => {
  const userId = c.get('userId');

  let failedItems: { cartItem: CartItemWithCatalogProduct; reason: string; }[] = []
  
  const dbcartItems = (async () => {
    const changeItems: { cartItem: CartItemWithCatalogProduct; operation: string; }[] = [];

    const cartItems = await db.cartItem.findMany({
      where: {
        userId
      },
      include: {
        CatalogProduct: {
          include: {
            images: true
          }
        }
      }
    });
    cartItems.forEach((cartItem) => {
      if (cartItem.price !== cartItem.CatalogProduct.price) {
        failedItems.push({
          cartItem,
          reason: "価格が更新されました。"
        });
        changeItems.push({
          cartItem,
          operation: "update",
        });
      }
      if (cartItem.CatalogProduct.deletedAt) {
        failedItems.push({
          cartItem,
          reason: "この商品は削除されました。"
        });
        changeItems.push({
          cartItem,
          operation: "delete"
        });
      }
    });
    if (changeItems.length === 0) return cartItems;


    await db.$transaction(async (tx) => {
      await Promise.all(changeItems.map((item): any => {
        switch (item.operation) {
          case 'update':
            return tx.cartItem.update({
              data: {
                price: item.cartItem.CatalogProduct.price
              },
              where: {
                id: item.cartItem.id
              }
            });
          case 'delete':
            return tx.cartItem.delete({
              where: {
                id: item.cartItem.id
              }
            });
        }
      }));
    });

    return cartItems;
  })
  const cartItems = await dbcartItems();
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)
  return c.json({
    cartItems: cartItems,
    totalPrice,
    failedItems: failedItems
  })
}