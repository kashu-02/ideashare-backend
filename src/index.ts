import { Hono } from 'hono';

import companies from './routes/companies'
import problems from './routes/problems'
import catalogs from './routes/catalogs';
import getOneProduct from './routes/catalogs/products/getOneProduct';
import account from './routes/account';
import cart from './routes/cart';
import checkout from './routes/checkout';
import { jwtVerifyMiddleware } from './routes/middleware/jwtVerifyMiddleware';

const app = new Hono();

app.get('/products/:productId', getOneProduct) 
app.route('/problems', problems)
app.route('/companies', companies)
app.route('/catalogs', catalogs)

app.use(jwtVerifyMiddleware())
app.route('/account', account)
app.route('/cart', cart)
app.route('/checkout', checkout)


export default app;