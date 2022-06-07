const {v4: uuid} = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  const {email, displayName, password} = ctx.request.body;

  const user = new User({
    email,
    displayName,
    password,
    verificationToken: token,
  });
  await user.setPassword(password);

  await user.validate();

  await user.save();

  await sendMail({
    template: 'confirmation',
    locals: {token},
    to: email,
    subject: 'Подтвердите почту',
  }).then(() => {
    ctx.body = {status: 'ok'};
  });
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;

  const user = await User.findOneAndUpdate(
      {verificationToken},
      {$unset: {verificationToken}},
  );

  if (!user) {
    ctx.statusCode = 400;
    return ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  }

  const token = uuid();
  await Session.updateOne({user}, {token});

  ctx.body = {token};
};
