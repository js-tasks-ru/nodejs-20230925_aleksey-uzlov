const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({chat: ctx.user.id}).limit(20);
  const messagesDTO = messages.map(mapMessage);

  ctx.body = {
    messages: messagesDTO
  };
};
