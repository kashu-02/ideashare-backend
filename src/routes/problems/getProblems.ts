import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

export default async (c: Context) => {
  const includeOverdue = c.req.query('includeOverdue') === 'true';
  const includeQuestions = c.req.query('includeQuestions') === 'true';

  const dbFindOptions: Prisma.ProblemFindManyArgs = {
    include: {
      Company: true
    }
  }

  if (!includeOverdue) {
    dbFindOptions.where = {
      deadline: {
        gte: dayjs().toDate()
      }
    }
  }

  if (includeQuestions) {
    dbFindOptions.include = {
      ...dbFindOptions.include,
      questions: true
    }
  }
    
  const problems = await db.problem.findMany(dbFindOptions);

  return c.json(problems)
}