const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = await bcrypt.hash(password, 4);
    const user = await User.insert({ email, passwordHash });
    return user;
  }

  static async authorize({ email, password }) {
    
  }
};
