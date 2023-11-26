const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  const user = await User.findOne({email});
  if (user) {
    return done(null, user);
  } else {
    const newUser = new User({email, displayName});
    const err = newUser.validateSync();
    if (err) {
      return done(err);
    } else {
      await newUser.save();
      return done(null, newUser);
    }
  }
};
