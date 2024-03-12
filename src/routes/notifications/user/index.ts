import { Hono } from 'hono';

import addUserNotification from "./addUserNotification";
import getUserNotifications from "./getUserNotifications";
import getOneUserNotification from "./getOneUserNotification";

const userNotification = new Hono();

userNotification.post('/', addUserNotification )
userNotification.get('/', getUserNotifications)
userNotification.get('/:notificationId', getOneUserNotification)

export default userNotification;