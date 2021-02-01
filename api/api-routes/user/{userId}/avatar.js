module.exports = (store, filestore) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {userId} = req.params;
    const filepath = filestore.getPathAvatarByUserId(userId);
    res.sendFile(filepath);
  }

  get.apiDoc = {
    summary: 'get avatar for user by userId',
    operationId: 'getAvatar',
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

  return {
    parameters: [
      {
        name: 'userId',
        in: 'path',
        type: 'string',
        required: true,
        description: 'userId',
      },
    ],
    get,
  };
};