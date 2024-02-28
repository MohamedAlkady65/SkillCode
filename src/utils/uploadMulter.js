const multer = require("multer");
const AppError = require("./appError");

module.exports = ({
	type = "image",
	typeError = new AppError("Only image types is allowed", 400),
	sizeLimit = 10 ** 6,
} = {}) => {
	return multer({
		storage: multer.memoryStorage(),
		fileFilter: (req, file, cb) => {
			if (file.mimetype.startsWith(type)) {
				cb(null, true);
			} else {
				cb(typeError, false);
			}
		},
		limits: {
			fileSize: sizeLimit,
		},
	});
};
