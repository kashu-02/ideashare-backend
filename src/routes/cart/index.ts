import { Hono } from 'hono';

import addCart from "./addCart";
import getCart from "./getCart";

const carts = new Hono();

carts.post('/', addCart)
carts.get('/:cartId', getCart)

export default carts;