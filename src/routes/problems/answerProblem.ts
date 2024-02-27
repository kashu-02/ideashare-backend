import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

type AnswerProblemRequest = {
  userId: string;
  answer: string;
}
export default async (c: Context) => {
  const problemId = c.req.param('problemId')
  const questionId = c.req.param('questionId')

  const body: AnswerProblemRequest[] = await c.req.json();

  const answers = await db.problemAnswer.createMany({
    data: body.map((a) => {
      return {
        answer: a.answer,
        userId: a.userId,
        questionId,
        problemId
      }
    }
    ),
  })

  return c.json(answers)
}