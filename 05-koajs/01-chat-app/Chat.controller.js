const {v4} = require('uuid');

module.exports = class ChatController {
  constructor() {
    this.subscribers = Object.create(null);
    this.subscribe = this.subscribe.bind(this);
    this.publish = this.publish.bind(this);
  }

  async subscribe(ctx, next) {
    const subscribers = this.subscribers;
    const id = v4();

    const promise = new Promise((resolve) => {
      subscribers[id] = resolve;

      ctx.res.on('close', () => delete subscribers[id]);
    });

    const message = await promise;
    ctx.body = message;
  }

  async publish(ctx, next) {
    let subscribers = this.subscribers;
    const message = ctx.request.body.message;

    if (!message) {
      ctx.throw(400);
    }

    for (const id in subscribers) {
      if (subscribers[id]) {
        const resolve = subscribers[id];
        resolve(message);
        ctx.res.statusCode = 200;
      }
    }

    subscribers = Object.create(null);
  }
};
