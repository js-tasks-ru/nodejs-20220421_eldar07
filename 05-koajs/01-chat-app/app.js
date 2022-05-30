const path = require('path');
const Koa = require('koa');
const ChatController = require('./Chat.controller');

const app = new Koa();
const controller = new ChatController();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', controller.subscribe);

router.post('/publish', controller.publish);

app.use(router.routes());

module.exports = app;
