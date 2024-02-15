const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message || "",
		errors: err.errors,
		error: err,
		stack: err.stack,
	});
};
const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message || "",
			errors: err.errors,
		});
	} else {
		res.status(500).json({
			status: "error",
			message: "Server Error, Something went wrong",
		});
	}
};

const handleJoiValidationErrors = (error) => {
	if (error.isJoi) {
		const details = error.details.map((err) => {
			return {
				field: err.path.join("."),
				message: err.message,
			};
		});
		return new AppError("Validation Error", 400, details);
	}
	return error;
};
const handleDuplicateEntryError = (error) => {
	if (error.code == "ER_DUP_ENTRY") {
		return new AppError(error.message, 400);
	}
	return error;
};
const handleMulterError = (error) => {
	if (error.name == "MulterError") {
		if (error.code == "LIMIT_FILE_SIZE") {
			return new AppError(`${error.field} must be at most 1MB`, 400);
		} else {
			return new AppError(error.message, 400);
		}
	}
	return error;
};

module.exports = (err, req, res, next) => {
	let error = err;
	error = handleJoiValidationErrors(error);
	error = handleDuplicateEntryError(error);
	error = handleMulterError(error);

	error.statusCode = error.statusCode || 500;
	error.status = error.status || "error";

	if (process.env.ENV == "development") {
		sendErrorDev(error, res);
	} else if (process.env.ENV == "production") {
		sendErrorProd(error, res);
	}
};
