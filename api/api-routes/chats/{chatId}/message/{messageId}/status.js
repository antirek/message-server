module.exports = (store, websocketServer) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function post(req, res) {
    const { chatId, messageId } = req.params;
    const { status } = req.body;

    console.log('get request params', req.params);
    console.log('get request body', req.body);
    const muStatus = await store.setMessageUserStatus(chatId, req.user.userId, messageId, status);


    const countNotViewed = await store.getMessageUserStatusNotViewed(chatId, req.user.userId);
    console.log('countNotViewed', countNotViewed);
    if (countNotViewed > 0) {
      websocketServer.send(req.user.userId, JSON.stringify({type:'countNotViewed', content: {chatId, userId: req.user.userId, countNotViewed}}));
    }

    res.json(muStatus);
  }

  post.apiDoc = {
    summary: 'set status for message by chatId, userId',
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
      {
        name: 'messageId',
        in: 'path',
        type: 'string',
        required: true,
        description: 'messageId',
      },
    ],
    post: post,
  };
};