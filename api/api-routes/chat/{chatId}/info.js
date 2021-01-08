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
    };
  };