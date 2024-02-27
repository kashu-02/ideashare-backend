import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Cart, CartItem, CatalogProduct, Prisma } from '@prisma/client';

type CartItemWithCatalogProduct = CartItem & {
  CatalogProduct: CatalogProduct
}
export default async (c: Context) => {
  const userId = c.get('userId');

  let failedItems: { cartItem: CartItemWithCatalogProduct; reason: string; }[] = []
  const carts = await db.cart.findUnique({
    where: {
      userId
    },
    include: {
      CartItems: {
        include: {
          CatalogProduct: true
        }
      }
    }
  })

  if (!carts) return c.json(carts)
  
  const cartItems = (async() => {
    const changeItems: { cartItem: CartItemWithCatalogProduct; operation: string; }[] = []

    const dbCartItems = carts.CartItems.map((cartItem) => {
      if (cartItem.price !== cartItem.CatalogProduct.price) {
        failedItems.push({
          cartItem,
          reason: "価格が更新されました。"
        })
        changeItems.push({
          cartItem,
          operation: "update",
        })
      }
      if (cartItem.CatalogProduct.deletedAt) {
        failedItems.push({
          cartItem,
          reason: "この商品は削除されました。"
        })
        changeItems.push({
          cartItem,
          operation: "delete"
        })
      }
    })
    if (changeItems.length === 0) return dbCartItems
    

    await db.$transaction(async(tx) => {
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
            })
          case 'delete':
            return tx.cartItem.delete({
              where: {
                id: item.cartItem.id
              }
            })
        }
      }))
      const totalPrice = changeItems.reduce((acc, cur) => acc += cur.cartItem.CatalogProduct.price || 0, 0)
      await tx.cart.update({
        data: {
          total: totalPrice
        },
        where: {
          userId
        }
      })
     })
    

    const updatedCart = await db.cart.findUnique({
      where: {
        userId
      },
      include: {
        CartItems: {
          include: {
            CatalogProduct: true
          }
        }
      }
    })
    return updatedCart
  })

  return c.json({
    successedItems: cartItems,
    failedItems: failedItems
  })
}