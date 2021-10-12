
const instagram_private_api_1 = require("instagram-private-api");
const fs = require('fs');
const redisConnection = require('./redisDatabase');
const { get } = require("http");
class Session {
  constructor() {
    this.redis = new redisConnection();
  }
  fakeSave(key, data) {
    // here you would save it to a file/database etc.
    // you could save it to a file: writeFile(path, JSON.stringify(data))
    //fs.writeFileSync('test.txt', JSON.stringify(data));
    this.redis.set(key, JSON.stringify(data));
    return data;
  }

  fakeExists(key) {
    // here you would check if the data exists
    return this.redis.check(key);
  }

  fakeLoad(key) {
    // here you would load the data
    // let data=fs.readFileSync('test.txt' , 'utf8');
    // let data1 = JSON.parse(JSON.stringify(data));
    console.log(this.redis.get(key));
    return this.redis.get(key);
  }

  saveSession(username, password) {
    (async () => {
      const ig = new instagram_private_api_1.IgApiClient();
      ig.state.generateDevice(username);
      ig.state.proxyUrl = process.env.IG_PROXY;
      // This function executes after every request
      ig.request.end$.subscribe(async () => {
        const serialized = await ig.state.serialize();
        delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
        rhis.fakeSave(username, serialized);
      });
      if (this.fakeExists(username)) {
        // import state accepts both a string as well as an object
        // the string should be a JSON object
        await ig.state.deserialize(this.fakeLoad(username));
      }
      // This call will provoke request.end$ stream
      await ig.account.login(username, password);
      // Most of the time you don't have to login after loading the state
    })();
  }
  loadSession(req, ig) {
  //  if (fakeExists(username)) {
      ig.state.deserialize(req);
      return ig;
    //}
    //return null;
  }
}
module.exports = Session;
