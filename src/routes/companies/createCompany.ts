import db from '../../infra/prisma';

import type { Context } from 'hono';
import type { Prisma } from '@prisma/client';

export default async (c: Context) => {
  const body = await c.req.json();
  const company: Prisma.CompanyCreateInput = {
    name: body.name,
  }
  const createCompany = await db.company.create({ data: company })

  return c.json(createCompany)
}
