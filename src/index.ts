import { Hono } from 'hono';

import companies from './routes/companies'
import problems from './routes/problems'
import catalogs from './routes/catalogs';
import getOneProduct from './routes/catalogs/products/getOneProduct';
import account from './routes/account';
import cart from './routes/cart';
import { jwtVerifyMiddleware } from './routes/middleware/jwtVerifyMiddleware';

const app = new Hono();

app.get('test', jwtVerifyMiddleware(), (c) => {
  return c.json({
    message: 'Hello World',
    userId: c.get('userId')
  })
})

app.get('/products/:productId', getOneProduct) 
app.route('/problems', problems)
app.route('/companies', companies)
app.route('/catalogs', catalogs)

app.use(jwtVerifyMiddleware())

app.route('/account', account)
app.route('/cart', cart)


export default app;