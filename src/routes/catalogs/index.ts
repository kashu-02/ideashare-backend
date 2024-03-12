import { Hono } from 'hono';

import createCatalog from './createCatalog';
import getCatalogs from './getCatalogs';
import getCatalog from './getCatalog';
import productsRoute from './products';

const catalogs = new Hono();

catalogs.post('/', createCatalog)
catalogs.get('/', getCatalogs)
catalogs.get('/:catalogId', getCatalog)
catalogs.route('/:catalogId/products', productsRoute)

export default catalogs;
