import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';

export default async (c: Context) => {
  const userId = c.get('userId');
  const user = await db.problem.findUnique({
    where: {
      id: userId
    }
  })
  if (!user) {
    return c.notFound()
  }

  return c.json(user)
}