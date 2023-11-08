const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrderConfirmation = require('../mappers/orderConfirmation');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;

  const order = new Order({
    user: ctx.user.id,
    product,
    phone,
    address
  });
  await order.save();

  await sendMail({
    template: 'order-confirmation',
    locals: mapOrderConfirmation(order, product),
    to: ctx.user.email,
    subject: 'Подтвердите почту',
  });

  ctx.body = {
    order: order.id
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user.id}).populate('product');
  ctx.body = {
    orders
  };
};
