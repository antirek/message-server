const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  name: String,
  avatarUrl: String,
});

const MessageSchema = new mongoose.Schema({
  date: String,
  chatId: String,
  sender: UserSchema,
  type: String,
  content: String,
});

const ChatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    unique: true,
  },
  ownerId: String,
});

const ChatUserSchema = new mongoose.Schema({
  chatId: String,
  userId: String,
});

module.exports = {
  UserSchema,
  MessageSchema,
  ChatSchema,
  ChatUserSchema,
};