import dayjs from 'dayjs';

import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

type ProblemBody = {
  title: string;
  imageUrl: string;
  content: string;
  rewards: number;
  questions: {
    question: string;
    required: boolean;
  }[];
  deadline: string;
  companyId: string;
}

export default async (c: Context) => {
  const body: ProblemBody = await c.req.json();

  const questions = body.questions.map((q) => {
    return {
      question: String(q.question),
      required: Boolean(q.required)
    }
  })
  const problem: Prisma.ProblemCreateInput = {
    title: body.title,
    imageUrl: body.imageUrl,
    content: body.content,
    deadline: dayjs(body.deadline).toDate(),
    rewards: Number(body.rewards),
    questions: {
      create: questions
    },
    Company: {
      connect: {
        id: body.companyId
      }
    }
  }

    const createProblem = await db.problem.create({
      data: problem
    })

  return c.json(createProblem)
  }
