const sharp = require("sharp");

module.exports = async ({ file, path, resize = true }) => {
	const sharpImage = sharp(file.buffer);
	if (resize) {
		sharpImage.resize(500, 500, { fit: "cover" });
	}
	sharpImage.toFormat("jpeg").jpeg();
	await sharpImage.toFile(path);
};
