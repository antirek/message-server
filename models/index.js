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

MessageSchema.index({messageId:1, chatId:1},{unique: true});

const MessageUserStatusSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  sended: {
    type: Boolean,
    default: false,
  },
  received: {
    type: Boolean,
    default: false,
  },
  viewed: {
    type: Boolean,
    default: false,
  },
});

MessageUserStatusSchema.index({messageId:1, chatId:1, userId:1},{unique: true});

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
  MessageUserStatusSchema,
};