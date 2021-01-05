module.exports = (store) => {
    /**
      *
      * @param {Object} req
      * @param {Object} res
      */
    async function get(req, res) {
      const userId = req.user.userId;
      console.log('get request params', req.params);
      const users = await store.getChatsByUserId(userId);
      res.json(users);
    }
  
    get.apiDoc = {
      summary: 'get chats current user',
      operationId: 'getChats',
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
    const { name, ownerId } = req.body;
    console.log('get request body', req.body);
    try {
      const chat = await store.addChat(name, req.user.userId);
      console.log('chat 11', chat);
      const chatId = chat.chatId;
      await store.appendUserToChat(req.user.userId, chatId);
      res.json(chat);
    } catch (err) {
      console.log('error', err)
      res.status(500).json({status:'error'});
    }
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
    get,
    post,
  };
};