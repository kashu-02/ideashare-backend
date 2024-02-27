import dayjs from 'dayjs';

import db from '../../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

type NewsRequest = {
  title: string;
  content: string;
}

export default async (c: Context) => {
  const body: NewsRequest = await c.req.json();

  const news: Prisma.NewsCreateInput = {
    title: body.title,
    content: body.content,
  }

  const addNews = await db.news.create({
    data: news
  })

  return c.json(addNews)
}
