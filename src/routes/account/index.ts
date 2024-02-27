import { Hono } from 'hono';

import createAccount from './createAccount';
import getAccount from './getAccount';

const account = new Hono();

account.post('/create', createAccount);
account.get('/', getAccount);

export default account;
