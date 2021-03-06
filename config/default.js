const path = require('path');

module.exports = {
  baseUrl: 'http://localhost:3010',
  port: 3010,
  mongodb: 'mongodb://mongodb/message2',
  serviceAccountKeyPath: path.resolve('./config/serviceAccountKey.json'),
  beebon: {
    url: "https://beebon.services.mobilon.ru",
    source: '89830500208',
  },
  path: '/tmp',
};