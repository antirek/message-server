const mongoose = require('mongoose');

const createModels = (dbConn) => {
  const SenderSchema = new mongoose.Schema({
    name: String,
    avatarUrl: String,
    userId: String,
    botId: String,
  },{ 
    discriminatorKey: 'type', 
    _id: false, 
    collection: 'users',
  });

  const MessageSchema = new mongoose.Schema({
    messageId: {
      type: String,
      index: true,
    },
    date: String,
    chatId: String,
    sender: SenderSchema,
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

  const Sender = dbConn.model('Sender', SenderSchema);
  const Chat = dbConn.model('Chat', ChatSchema);
  const ChatUser = dbConn.model('ChatUser', ChatUserSchema);
  const ChatBot = dbConn.model('ChatBot', ChatBotSchema);
  const Message = dbConn.model('Message', MessageSchema);
  const Token = dbConn.model('Token', TokenSchema);
  const PhoneCode = dbConn.model('PhoneCode', PhoneCodeSchema);
  const Registration = dbConn.model('Registration', RegistrationSchema);
  const MessageUserStatus = dbConn.model('MessageUserStatus', MessageUserStatusSchema);

  const User = Sender.discriminator('user', new mongoose.Schema({  
    userId: {
      type: String,
      unique: true,
    }
  }));

  const Bot = Sender.discriminator('bot', new mongoose.Schema({  
    botId: {
      type: String,
      unique: true,
    },
  }));

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