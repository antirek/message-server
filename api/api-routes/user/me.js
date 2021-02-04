module.exports = (store, config) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const user = Object.assign({}, req.user,
    {
      avatarUrl: `${config.baseUrl}/v1/user/${req.user.userId}/avatar`,
    });
    console.log('user', user);
    res.json(user);
  }

  get.apiDoc = {
    summary: 'get current user by token',
    operationId: 'Me',
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
    const userId = req.user.userId;
    const {name, avatarUrl} = req.body;
    const user = await store.getUser(userId);

    if (!user) {
      console.log('no user in db');
      return res.sendStatus(500);
    }

    if (name) {
      user.name = name;
    }
    if (avatarUrl) {
      user.avatarUrl = avatarUrl;
    }
    await user.save();

    res.json(user);
  }

  post.apiDoc = {
    summary: 'set info curernt user',
    operationId: 'updateMe',
    tags: ['user'],
    produces: [
      'application/json',
    ],
    parameters: [
      {
        in: 'body',
        name: 'object',
        description: 'user profile',
        schema: {
          type: 'object',
          example: {
            name: 'user name',
            avatarUrl: 'https://cdn.quasar.dev/img/avatar2.jpg',
          }
        },
      },
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
    get,
    post,
  };
};