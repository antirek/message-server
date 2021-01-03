const express = require('express');
const cors = require('cors');
const openapi = require('express-openapi');

const createApp = (api, security) => {
  const app = express();

  app.use(express.json({limit: '1mb'}));
  app.use(cors());

  openapi.initialize({
    apiDoc: api.apiDoc, // require('./api-doc.js'),
    app: app,
    docsPath: '/api',
    paths: api.paths, // path.resolve(__dirname, 'api-routes'),
    dependencies: api.dependencies,
    securityHandlers: {
      token: async function(req, scopes, definition) {
        console.log('access requested',
            {token: req.headers['x-api-key']});
        return await security.check(req);
      },
    },
  });

  return app;
};

exports.createApp = createApp;