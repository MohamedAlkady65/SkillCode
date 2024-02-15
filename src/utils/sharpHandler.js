const sharp = require("sharp");

module.exports = async ({ file, path }) => {
	await sharp(file.buffer)
		.resize(500, 500, { fit: "cover" })
		.toFormat("jpeg")
		.jpeg()
		.toFile(path);
};
