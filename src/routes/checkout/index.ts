import { Hono } from 'hono';

import placeOrder from "./placeOrder";

const checkout = new Hono();

checkout.post('/placeorder', placeOrder)

export default checkout;