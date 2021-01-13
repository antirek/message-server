module.exports = {
  swagger: '2.0',
  basePath: '/v1',
  schemes: ['http'],
  info: {
    title: 'message api',
    version: '1.0.0',
  },
  definitions: {
    Error: {
      additionalProperties: true,
    },
  },
  securityDefinitions: {
   //X-API-Key: abcdef12345
   token: {
     type: 'apiKey',
     in: 'header',
     name: 'X-API-Key',
   },
  },
  security: [
    {
      'token': [],
    },
  ],
  // paths are derived from args.routes.  These are filled in by fs-routes.
  paths: {},
};