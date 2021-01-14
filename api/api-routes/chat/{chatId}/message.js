module.exports = (store, websocketServer, firebaseClient) => {
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

    const messageFormated = message.toObject();
    messageFormated.viewed = false;

    const muStatus = await store.setMessageUserStatus(chatId, req.user.userId, messageId, 'viewed');
    console.log('muStatus', muStatus);

    const users = await store.getUsersByChatId(chatId);
    console.log('send message users', users);

    // websoket'ы рассылаем всем, а firebase всем, кроме отправителя
    for (const user of users) {
      await store.setMessageUserStatus(chatId, user.userId, messageId, 'sended');
      if (user.userId === req.user.userId) { messageFormated.viewed = true;}
      console.log('message', messageFormated);
      websocketServer.send(user.userId, JSON.stringify({type: 'message', content: messageFormated}));

      if (user.userId === req.user.userId) {
        console.log('skip session user', user.userId);
        continue;
      }                  
      const m = {data: JSON.stringify(messageFormated), type: 'message'};
      console.log('firebase message', m);
      try {
        await firebaseClient.sendMessage(user.userId, m);
      } catch(e) {
        console.log('error:', e);
      }
    }

    for (const user of users) {
      const countNotViewed = await store.getMessageUserStatusNotViewedCount(chatId, user.userId);
      console.log('countNotViewed', countNotViewed);
      websocketServer.send(user.userId, JSON.stringify({
        type:'countNotViewed',
        content: {
          chatId,
          userId: user.userId,
          countNotViewed,
        },
      }));
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
          example: {
            content: "example content",
            type: "text"
          },
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