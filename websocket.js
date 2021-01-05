const WebSocket = require('ws');

class WServer {
  subscribers = {};
  wServer;

  setServer (server) {
    const subs = {};
    function onMessage (data, ws) {
      console.log('on message', data);
      const message = JSON.parse(data);
      if (message.action === 'subscribe') {
        const userId = message.userId;
        subs[userId] = ws;
      }
    }
    
    this.wServer = new WebSocket.Server({ server });

    this.wServer.on('connection', function connection(ws) {
      // console.log('connection', ws);
      ws.on('message', function(data) {
        onMessage(data, ws);
      });
    });

    this.subscribers = subs;
  }

  getWServer() {
    return this.wServer;
  }

  listConnections () {
    console.log(this.subscribers);
  }

  send(userId, message) {
    const userConnection = this.subscribers[userId];
    if (!userConnection) {
      console.log('skip', userId); 
      return;
    }
    userConnection.send(message);
  }
}

module.exports = {WServer};