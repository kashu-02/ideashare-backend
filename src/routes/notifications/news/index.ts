import { Hono } from 'hono';

import addNews from "./addNews";
import getNews from "./getNews";
import getOneNews from "./getOneNews";

const news = new Hono();

news.post('/', addNews )
news.get('/', getNews)
news.get('/:newsId', getOneNews)

export default news;