import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

export default async (c: Context) => {
  const problemId = c.req.param('problemId')

  const problem = await db.problem.findUnique({
    where: {
      id: problemId
    },
    include: {
      Company: true,
      questions: true
    }
  });

  return c.json(problem)
}