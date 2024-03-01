import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

type AnswerProblemRequest = {
  questionId: string;
  answer: string;
}
export default async (c: Context) => {
  const problemId = c.req.param('problemId')
  const userId = c.get('userId');
  console.log('userId', userId)
  const body: AnswerProblemRequest[] = await c.req.json();
  console.log('body', body)
  const answers = await db.problemAnswer.createMany({
    data: body.map((a) => {
      return {
        answer: a.answer,
        userId: userId,
        questionId: a.questionId,
        problemId
      }
    }
    ),
  })

  return c.json(answers)
}