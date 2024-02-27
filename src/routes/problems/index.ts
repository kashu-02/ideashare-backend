import { Hono } from 'hono';

import addProblem from './addProblem'
import getProblem from './getProblems'

const problems = new Hono();

problems.post('/', addProblem)
problems.get('/', getProblem)

export default problems;
