module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function post(req, res) {    
    const { chatId, ownerId } = req.body;
    console.log('get request body', req.body);
    const chat = await store.addChat(chatId, ownerId);
    res.json(chat);
  }

  post.apiDoc = {
    summary: 'create chat',
    operationId: 'createChat',
    tags: ['chat'],
    produces: [
      'application/json',
    ],
    parameters: [
      {
        in: 'body',
        name: 'object',
        description: 'chat json',
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
    post,
  };
};