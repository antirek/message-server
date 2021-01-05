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
  messageId: {
    type: String,
    index: true,
  },
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
  name: String,
  ownerId: String,
});

const ChatUserSchema = new mongoose.Schema({
  chatId: {
    type: String,
    index: true,
  },
  userId: {
    type: String,
    index: true,
  },
});

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
  },
  userId: {
    type: String,
    unique: true,
  },
});

module.exports = {
  UserSchema,
  MessageSchema,
  ChatSchema,
  ChatUserSchema,
  TokenSchema,
};