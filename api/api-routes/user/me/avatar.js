module.exports = (filestore) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function post(req, res) {
    const userId = req.user.userId;
    

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('no files');
      res.json({status: 'FAIL'});
    }

    //console.log(req.files);
    await filestore.addAvatarForUserId(req.files.avatar, userId);
    
    res.json({});
  }

  post.apiDoc = {
    summary: 'post file to user avatar',
    operationId: 'postMessage',
    tags: ['user'],
    produces: [
      'application/json',
    ],
    consumes: [
      'multipart/form-data'
    ],
    parameters: [
      {
        in: 'formData',
        name: 'avatar',
        description: 'message json',
        type: 'file',
        
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
    post: post,
  };
};