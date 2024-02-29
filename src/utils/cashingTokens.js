const cashe = require("../config/cashe.js");

module.exports = {
	get: (token) => {
		return cashe.get(`user-${token}`);
	},
	delete: (token) => {
		cashe.delete(`user-${token}`);
	},
	set: (token, user) => {
		cashe.set(`user-${token}`, user);
	},
};
