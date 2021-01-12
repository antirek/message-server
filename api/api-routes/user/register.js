module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function post(req, res) {
    const { token } = req.body;
    console.log('get request body', req.body);
    await store.updateUserRegistration(req.user.userId, token);
    res.json({status:'OK'});
  }

  post.apiDoc = {
    summary: 'register FCM token',
    operationId: 'createChat',
    tags: ['user'],
    produces: [
      'application/json',
    ],
    parameters: [
      {
        in: 'body',
        name: 'object',
        description: 'token',
        schema: {
          type: 'object',
          example: {
            token: 'testToken'
          }
        },
      },
    ],
    responses: {
      200: {
        description: 'register',
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