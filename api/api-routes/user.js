module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {chatId} = req.params;
    console.log('get request params', req.params);
    const users = await store.getUsers();
    res.json(users);
  }

  get.apiDoc = {
    summary: 'get users',
    operationId: 'getUsers',
    tags: ['user'],
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
    const { userId, name, avatarUrl } = req.body;
    console.log('get request body', req.body);
    const user = await store.addUser(userId, name, avatarUrl);
    res.json(user);
  }

  post.apiDoc = {
    summary: 'add user',
    operationId: 'postUser',
    tags: ['user'],
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
    get,
    post,
  };
};