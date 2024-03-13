import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

type UserBody = {
  email: string;
  nickname?: string;
  name?: string;
  sex?: number;
  birthday?: string;
  address?: string;
  avatar?: string;
}

export default async (c: Context) => {
  const body: UserBody = await c.req.json();
  const userId = c.get('userId');
  console.log('userId', userId)
  const user: Prisma.UserUpdateInput = {
    email: body.email,
    nickname: body.nickname,
    name: body.name || null,
    sex: Number(body.sex) || 0,
    birthday: body.birthday ? dayjs(body.birthday).format("YYYY-MM-DD") : null,
    address: body.address || null,
    avatar: body.avatar || null,
  }

  const updateUser = await db.user.update({
    where: {
      id: userId
    },
    data: user
  })

  return c.json(updateUser)
}
