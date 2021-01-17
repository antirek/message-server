module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {chatId} = req.params;
    console.log('get request params', req.params);
    const chat = await store.getChatByChatId(chatId);
    res.json(chat);
  }

  get.apiDoc = {
    summary: 'get chat info chatId',
    operationId: 'getChatInfo',
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
    const {chatId} = req.params;
    const {name} = req.body;
    console.log('postChatInfo', chatId, name);

    const chat = await store.getChatByChatId(chatId);
    
    if (req.user.userId !== chat.ownerId) {
      console.log('chat owner is not current user');
      return res.sendStatus('403');
    }

    chat.name = name;
    await chat.save();

    res.send({status:'OK'});
  }

  post.apiDoc = {
    summary: 'post info chat',
    operationId: 'postChatInfo',
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
            name: "example name",
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
    get,
    post,
  };
};