class AppError extends Error {
	constructor(message, statusCode, errors) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.status = Math.floor(statusCode / 100) == 4 ? "fail" : "error";
		if (errors) {
			this.errors = errors;
		}
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;
