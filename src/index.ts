import { Hono } from 'hono';

import companies from './routes/companies'
import problems from './routes/problems'
import catalogs from './routes/catalogs';
import getOneProduct from './routes/catalogs/products/getOneProduct';
import account from './routes/account';
import cart from './routes/cart';
import checkout from './routes/checkout';
import notifications from './routes/notifications';
import { jwtVerifyMiddleware } from './routes/middleware/jwtVerifyMiddleware';

const app = new Hono();
app.get('/', (c) => {
  return c.json({ message: 'Success' });
});
app.get('/products/:productId', getOneProduct) 
app.route('/problems', problems)
app.route('/companies', companies)
app.route('/catalogs', catalogs)

app.use(jwtVerifyMiddleware())
app.route('/account', account)
app.route('/cart', cart)
app.route('/checkout', checkout)
app.route('/notifications', notifications)


export default app;