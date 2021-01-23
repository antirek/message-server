module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const userId = req.user.userId;
    console.log('get request params', req.params);
    const invites = await store.getInvitesByUserId(userId);
    res.json(invites);
  }

  get.apiDoc = {
    summary: 'get invites current user',
    operationId: 'getInvites',
    tags: ['invite'],
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
    get,
  };
};