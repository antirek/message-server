const path = require('path');

module.exports = {
    port: 3010,
    mongodb: 'mongodb://mongodb/message',
    serviceAccountKeyPath: path.resolve('./config/serviceAccountKey.json'),
    beebonUrl: "https://beebon.services.mobilon.ru",
}