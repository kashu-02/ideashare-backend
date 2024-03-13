import { Hono } from 'hono';

import createAccount from './createAccount';
import getAccount from './getAccount';
import updateAccount from './updateAccount';

const account = new Hono();

account.post('/create', createAccount);
account.get('/', getAccount);
account.put('/', updateAccount);

export default account;
