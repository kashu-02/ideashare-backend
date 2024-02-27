import { Hono } from 'hono';

import createCompany from './createCompany';

const companies = new Hono();

companies.post('/', createCompany)

export default companies;
