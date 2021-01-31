const mongoose = require('mongoose');

const createModels = (dbConn) => {
  const UserSchema = new mongoose.Schema({
    userId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      default: 'Unknown',
    },
    avatarUrl: String,
    phone: {
      type: String,
      unique: true,
      required: true,
    },
  });

  const BotSchema = new mongoose.Schema({
    botId: String,
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
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
  });

  const ChatUserSchema = new mongoose.Schema({
    chatId: {
      type: String,
      index: true,
      required: true,
    },
    userId: {
      type: String,
      index: true,
      required: true,
    },
    role: {
      type: String,
      index: true,
      required: true,
      default: 'user',
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
    },
  });

  const InviteSchema = new mongoose.Schema({
    inviteId: {
      type: String,
      unique: true,
    },
    chatId: {
      type: String,
    },
    userId: {
      type: String,
    },
    status: {
      type: String,
    },
  });

  const User = dbConn.model('User', UserSchema);
  const Bot = dbConn.model('Bot', BotSchema);
  const Chat = dbConn.model('Chat', ChatSchema);
  const ChatUser = dbConn.model('ChatUser', ChatUserSchema);
  const ChatBot = dbConn.model('ChatBot', ChatBotSchema);
  const Message = dbConn.model('Message', MessageSchema);
  const Token = dbConn.model('Token', TokenSchema);
  const PhoneCode = dbConn.model('PhoneCode', PhoneCodeSchema);
  const Registration = dbConn.model('Registration', RegistrationSchema);
  const Invite = dbConn.model('Invite', InviteSchema);
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
    Invite,
    PhoneCode,
  };
}

module.exports = {createModels};