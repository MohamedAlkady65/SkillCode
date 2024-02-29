const NodeCache = require("node-cache");

class Cash {
	constructor() {
		this.cache = new NodeCache({ stdTTL: 900, checkperiod: 300 });
	}

	get(key) {
		return this.cache.get(key);
	}
	set(key, value, ttl) {
		if (ttl) {
			this.cache.set(key, value, ttl);
		} else {
			this.cache.set(key, value);
		}
	}
	delete(key) {
		this.cache.del(key);
	}
}

module.exports = new Cash();
