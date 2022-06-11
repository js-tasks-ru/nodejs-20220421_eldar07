const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;

  const order = new Order({
    product,
    phone,
    address,
    user: ctx.user,
  });

  await order.validate();

  await order.save();

  ctx.body = {order: order.id};

  await sendMail({
    template: 'order-confirmation',
    locals: {
      id: order.id,
      product,
    },
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
  });
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user});
  ctx.body = {orders: orders.map(mapOrder)};
};
