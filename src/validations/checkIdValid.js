const AppError = require("../utils/appError");

module.exports = (id, message, code = 404) => {
	const id_ = +id;
	if (isNaN(id_)) {
		throw new AppError(message, code);
	}
	return id_;
};
