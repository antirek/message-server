const path = require('path');
const fs = require('fs');

class Filestore {
  path;
  
  constructor ({path}) {
      this.path = path;
  }

  getPathAvatarByUserId (userId) {
    // console.log(this.path, userId);
    return path.join(this.path, userId, 'avatar.png');
  }

  async addAvatarForUserId (file, userId) {
    const dir = path.join(this.path, userId);

    const existDir = fs.existsSync(dir);
    console.log({existDir});
    
    if (!existDir) {
      console.log('mkdir', dir);
      fs.mkdirSync(dir);
    }

    return new Promise((resolve, reject) => {
      file.mv(this.getPathAvatarByUserId(userId), (err) => {
        if(err) {reject()}
        resolve();
      })
    })
  }
}

module.exports = {Filestore};