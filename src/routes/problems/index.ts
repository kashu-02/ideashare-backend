import { Hono } from 'hono';

import addProblem from './addProblem'
import getProblem from './getProblems'
import getOneProblem from './getOneProblem';
import answerProblem from './answerProblem';

import { jwtVerifyMiddleware } from '../middleware/jwtVerifyMiddleware';

const problems = new Hono();

problems.post('/', addProblem)
problems.get('/', getProblem)
problems.get('/:problemId', getOneProblem)

problems.use(jwtVerifyMiddleware())
problems.post('/answer/:problemId', answerProblem)

export default problems;
