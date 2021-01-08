const config = require('config');
const mongoose = require('mongoose');
const path = require('path');
mongoose.set('debug', true);
const http = require("http");

const createApp = require('./app').createApp;
const {createModels} = require('./models');

const {MessageServerStore} = require('./store');
const {TokenChecker} = require('./security');
const {WServer} = require('./websocket');

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const {
  User, Chat, ChatUser, Message, MessageUserStatus, 
  Bot, ChatBot, Token,
} = createModels(dbConn);

const store = new MessageServerStore({
  User, Chat, ChatUser, Message, MessageUserStatus,
  Bot, ChatBot,
});
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
