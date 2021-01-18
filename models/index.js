const mongoose = require('mongoose');

const createModels = (dbConn) => {
  const UserSchema = new mongoose.Schema({
    name: String,
    avatarUrl: String,
    userId: String,
    phone: String,    
  });

  const BotSchema = new mongoose.Schema({
    name: String,
    avatarUrl: String,
    userId: String,
  });

  const MessageSchema = new mongoose.Schema({
    messageId: {
      type: String,
      index: true,
    },
    date: String,
    chatId: String,
    sender: mongoose.Schema.Types.Mixed,
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

  const ChatBotSchema = new mongoose.Schema({
    chatId: {
      type: String,
      index: true,
    },
    botId: {
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

  const RegistrationSchema = new mongoose.Schema({
    token: {
      type: String,
      unique: true,
    },
    userId: {
      type: String,
      unique: true,
    },
    date: {
      type: String,
    },
  });

  const PhoneCodeSchema = new mongoose.Schema({
    phone: {
      type: String,
      unique: true,
    },
    code: {
      type: String,
      unique: true,
    },
  })

  const User = dbConn.model('User', UserSchema);
  const Bot = dbConn.model('Bot', BotSchema);
  const Chat = dbConn.model('Chat', ChatSchema);
  const ChatUser = dbConn.model('ChatUser', ChatUserSchema);
  const ChatBot = dbConn.model('ChatBot', ChatBotSchema);
  const Message = dbConn.model('Message', MessageSchema);
  const Token = dbConn.model('Token', TokenSchema);
  const PhoneCode = dbConn.model('PhoneCode', PhoneCodeSchema);
  const Registration = dbConn.model('Registration', RegistrationSchema);
  const MessageUserStatus = dbConn.model('MessageUserStatus', MessageUserStatusSchema);

  return {
    User,
    Message,
    Chat,
    ChatUser,
    Token,
    Registration,
    MessageUserStatus,
    Bot,
    ChatBot,
    PhoneCode,
  };
}

module.exports = {createModels};