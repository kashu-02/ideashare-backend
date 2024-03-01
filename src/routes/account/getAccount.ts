import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';

export default async (c: Context) => {
  const userId = c.get('userId');
  console.log('userId', userId)
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })
  if (!user) {
    return c.notFound()
  }
  console.log('user', user)
  return c.json(user)
}