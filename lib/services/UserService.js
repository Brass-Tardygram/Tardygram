const User = require('../models/User');
const md5 = require('md5');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = md5(password);
    const user = await User.insert({ email, passwordHash });
    return user;
  }
};
