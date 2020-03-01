const { Schema, model } = require('mongoose');
const config = require('config');

const Role = config.get('Role');

const schema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [Role.User, Role.Admin],
    default: Role.User,
    required: true
  },
  createdAt: { type: Date, default: new Date() },
  updateAt: { type: Date }
});

module.exports = model('User', schema);
