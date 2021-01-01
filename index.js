const config = require('config');
const mongoose = require('mongoose');
const path = require('path');

const createApp = require('./app').createApp;
const { 
    ChatSchema, 
    ChatUserSchema, 
    MessageSchema,
    UserSchema,
} = require('./models');
const {MessageServerStore} = require('./store');

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const User = dbConn.model('User', UserSchema);
const Chat = dbConn.model('Chat', ChatSchema);
const ChatUser = dbConn.model('ChatUser', ChatUserSchema);
const Message = dbConn.model('Message', MessageSchema);

const store = new MessageServerStore({User, Chat, ChatUser, Message});

const app = createApp({
  apiDoc: require('./api/api-doc.js'),
  paths: path.resolve(__dirname, 'api/api-routes'),
  dependencies: {
    store,
  },
});

app.listen(config.port, () => {
    console.log('started');
});
