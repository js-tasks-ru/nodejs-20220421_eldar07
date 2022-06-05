const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) return done(null, false, 'Не указан email');

    const error = new User({email, displayName}).validateSync();
    if (error) throw error;

    const user = await User.findOne({email});

    if (user) {
      return done(null, user);
    } else {
      const newUser = await User.create({
        email,
        displayName,
      });
      return done(null, newUser);
    }
  } catch (error) {
    return done(error);
  }
};
