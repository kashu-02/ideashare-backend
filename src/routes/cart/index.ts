import { Hono } from 'hono';

import addCart from "./addCart";
import getCart from "./getCart";
import updateCartItem from "./updateCartItem";

const carts = new Hono();

carts.post('/', addCart)
carts.get('/', getCart)
carts.patch('/', updateCartItem)

export default carts;