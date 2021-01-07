module.exports = (store) => {
    /**
      *
      * @param {Object} req
      * @param {Object} res
      */
    async function get(req, res) {
      const { chatId, messageId } = req.params;
      console.log('get request params', req.params);
  
      const muStatus = await store.setMessageUserStatus(chatId, req.user.userId, messageId, 'received');
      res.json(muStatus);      
    }
  
    get.apiDoc = {
      summary: 'mark message as received by chatId, userId',
      operationId: 'markMessageAsReceived',
      tags: ['chat'],
      produces: [
        'application/json',
      ],
      responses: {
        200: {
          description: 'mark message',
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
        {
          name: 'messageId',
          in: 'path',
          type: 'string',
          required: true,
          description: 'messageId',
        },
      ],
      get,
    };
  };