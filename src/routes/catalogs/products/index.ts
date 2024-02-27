import { Hono } from 'hono';

import addProducts from './addProducts';
import getProducts from './getProducts';
import getOneProduct from './getOneProduct';

const products = new Hono();

products.post('/', addProducts)
products.get('/', getProducts)
products.get('/:productId', getOneProduct)

export default products;
