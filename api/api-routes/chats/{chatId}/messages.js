module.exports = (store, websocketServer) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {chatId} = req.params;
    console.log('get request params', req.params);
    const messages = await store.getMessagesByChatId(chatId);
    res.json(messages);
  }

  get.apiDoc = {
    summary: 'get messages by chatId',
    operationId: 'getMessages',
    tags: ['chat'],
    produces: [
      'application/json',
    ],
    responses: {
      200: {
        description: 'requested messages',
      },
      default: {
        description: 'Unexpected error',
        schema: {
          $ref: '#/definitions/Error',
        },
      },
    },
  };

  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function post(req, res) {
    const { chatId } = req.params;
    const { content, type } = req.body;
    console.log('get request params', req.params);
    console.log('get request body', req.body);
    const message = await store.appendMessage(chatId, req.user, content, type);

    const users = await store.getUsersByChatId(chatId);
    console.log('send message users', users);
    users.forEach(user => {
      console.log('message', message);
      websocketServer.send(user.userId, JSON.stringify(message));
    });

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
    get: get,
    post: post,
  };
};