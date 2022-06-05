module.exports = function mustBeAuthenticated(ctx, next) {
  try {
    if (!ctx.user) throw new Error('Пользователь не залогинен');
    return next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = {error: error.message};
  }
};
