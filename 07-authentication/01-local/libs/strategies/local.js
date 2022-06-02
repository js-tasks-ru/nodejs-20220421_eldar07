const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      User.findOne({email}, async (error, user) => {
        if (error) return done(error);
        if (!user) return done(null, false, 'Нет такого пользователя');

        const passwordIsOk = await user.checkPassword(password);

        if (!passwordIsOk) {
          return done(null, false, 'Неверный пароль');
        } else if (passwordIsOk) {
          return done(null, user);
        };
        return done(null, false, 'Стратегия подключена, но еще не настроена');
      });
    },
);
