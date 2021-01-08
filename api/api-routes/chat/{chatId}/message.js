module.exports = (store, websocketServer) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function post(req, res) {
    const { chatId } = req.params;
    const { content, type } = req.body;
    console.log(' ----------------------- new message ------------------- ');
    console.log('req user', req.user);
    console.log('get request params', req.params);
    console.log('get request body', req.body);
    const message = await store.appendMessage(chatId, req.user, content, type);
    const messageId = message.messageId;

    const muStatus = await store.setMessageUserStatus(chatId, req.user.userId, messageId, 'viewed');
    console.log('muStatus', muStatus);

    const users = await store.getUsersByChatId(chatId);
    console.log('send message users', users);
    for (const user of users) {
      await store.setMessageUserStatus(chatId, user.userId, messageId, 'sended');
      console.log('message', message);
      websocketServer.send(user.userId, JSON.stringify({type: 'message', content: message}));
    }

    for (const user of users) {
      const countNotViewed = await store.getMessageUserStatusNotViewedCount(chatId, user.userId);
      console.log('countNotViewed', countNotViewed);
      if (countNotViewed > 0) {
        websocketServer.send(user.userId, JSON.stringify({type:'countNotViewed', content: {chatId, userId: user.userId, countNotViewed}}));
      }
    }
    res.json(message);
  }

  post.apiDoc = {
    summary: 'post message to chatId',
    operationId: 'postMessage',
    tags: ['chat'],
    produces: [
      'application/json',
    ],
    parameters: [
      {
        in: 'body',
        name: 'object',
        description: 'message json',
        schema: {
          type: 'object',
        },
      },
    ],
    responses: {
      200: {
        description: 'post message',
      },
      default: {
        description: 'Unexpected error',
        schema: {
          $ref: '#/definitions/Error',
        },
      },
    },
  };

  return {
    parameters: [
      {
        name: 'chatId',
        in: 'path',
        type: 'string',
        required: true,
        description: 'chatId',
      },
    ],
    post: post,
  };
};