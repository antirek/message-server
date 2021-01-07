module.exports = (store, websocketServer) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const { chatId, messageId } = req.params;
    console.log('get request params', req.params);

    const muStatus = await store.setMessageUserStatus(chatId, req.user.userId, messageId, 'viewed');
    res.json(muStatus);
    
    const countNotViewed = await store.getMessageUserStatusNotViewedCount(chatId, req.user.userId);
    console.log('countNotViewed', countNotViewed);
    const message = JSON.stringify({
      type:'countNotViewed',
      content: {
        chatId,
        userId: req.user.userId,
        countNotViewed,
      }
    });
    websocketServer.send(req.user.userId, message);
  }

  get.apiDoc = {
    summary: 'mark message as viewed by chatId, userId',
    operationId: 'markMessageAsViewed',
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