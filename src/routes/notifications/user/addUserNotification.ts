import dayjs from 'dayjs';

import db from '../../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

type UserNotificationRequest = {
  userId: string;
  title: string;
  content: string;
}

export default async (c: Context) => {
  const body: UserNotificationRequest = await c.req.json();

  const userNotification: Prisma.UserNotificationCreateInput = {
    title: body.title,
    content: body.content,
    User: {
      connect: {
        id: body.userId
      }
    }
  }

  const addUserNotification = await db.userNotification.create({
    data: userNotification
  })

  return c.json(addUserNotification)
}
