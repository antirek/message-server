const config = require('config');
const http = require("http");
const path = require('path');
const mongoose = require('mongoose');
mongoose.set('debug', true);

const {createApp} = require('./app');
const {createModels} = require('./models');

const {MessageServerStore} = require('./store');
const {TokenChecker} = require('./security');
const {WServer} = require('./websocket');
const {FirebaseClient} = require('./apiClients/firebaseClient');
const {BeebonClient} = require('./apiClients/beebonClient');


const serviceAccount = require(config.serviceAccountKeyPath);

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const {
  User, Chat, ChatUser, Message, MessageUserStatus, 
  Bot, ChatBot, Token, Registration, PhoneCode,
  Invite,
} = createModels(dbConn);

const store = new MessageServerStore({
  User, Chat, ChatUser, Message, MessageUserStatus,
  Bot, ChatBot, Registration, PhoneCode, Token,
  Invite,
});

const security = new TokenChecker({Token, User});
const websocketServer = new WServer();
const firebaseClient = new FirebaseClient({Registration, serviceAccount});
const beebonClient = new BeebonClient(config.beebon);

const app = createApp({
  apiDoc: require('./api/api-doc.js'),
  paths: path.resolve(__dirname, 'api/api-routes'),
  dependencies: {
    store,
    websocketServer,
    firebaseClient,
    beebonClient,
  },
}, security);

const server = http.createServer(app);
websocketServer.setServer(server);

server.listen(config.port, () => {
  console.log('started', config);
});
