const redis = require('redis');

class Redis {
    constructor() {
        this.redisClient = redis.createClient(6379, 'redis');
        this.redisClient.on('error', (err) => {
            console.log('Error occured while connecting or accessing redis server');
        });
    }

    set(key, value) {
        this.redisClient.set(key, value);
    }

    check(key) {
        if (this.redisClient.get(key)) {
            return true;
        }
        return false
    }

    get(key) {

        if (this.redisClient.get(key)) {
            let val = this.redisClient.get(key);
            let data = JSON.parse(JSON.stringify(val));
            return data;
        }
        return null;
    }

    destroy(key) {
        if (this.redisClient.get(key )) {
            this.redisClient.del(key);
        }
    }

}
module.exports = Redis;
