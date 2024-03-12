import { Hono } from 'hono';
import {jwtVerifyMiddleware} from '../middleware/jwtVerifyMiddleware';
import userNotification from './user';
import newsNotification from './news';

const notifications = new Hono();

notifications.route('/user', userNotification)
notifications.route('/news', newsNotification)

export default notifications;