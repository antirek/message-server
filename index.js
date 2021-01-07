const config = require('config');
const mongoose = require('mongoose');
const path = require('path');
mongoose.set('debug', true);
const http = require("http");

const createApp = require('./app').createApp;
const { 
  ChatSchema, 
  ChatUserSchema, 
  MessageSchema,
  UserSchema,
  TokenSchema,
  MessageUserStatusSchema,
} = require('./models');

const {MessageServerStore} = require('./store');
const {TokenChecker} = require('./security');
const {WServer} = require('./websocket');

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const User = dbConn.model('User', UserSchema);
const Chat = dbConn.model('Chat', ChatSchema);
const ChatUser = dbConn.model('ChatUser', ChatUserSchema);
const Message = dbConn.model('Message', MessageSchema);
const Token = dbConn.model('Token', TokenSchema);
const MessageUserStatus = dbConn.model('MessageUserStatus', MessageUserStatusSchema);

const store = new MessageServerStore({User, Chat, ChatUser, Message, MessageUserStatus});
const security = new TokenChecker({Token, User});
const websocketServer = new WServer();

const app = createApp({
  apiDoc: require('./api/api-doc.js'),
  paths: path.resolve(__dirname, 'api/api-routes'),
  dependencies: {
    store,
    websocketServer,
  },
}, security);

const server = http.createServer(app);
websocketServer.setServer(server);

server.listen(config.port, () => {
  console.log('started');
});
