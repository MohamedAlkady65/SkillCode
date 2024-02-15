const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.hashPassword = async (password) => await bcrypt.hash(password, 12);

exports.compareHashedPassword = async (password, hashedPasword) =>
	await bcrypt.compare(password, hashedPasword);

exports.hashSHA256 = async (token) =>
	await crypto.createHash("sha256").update(token).digest("hex");

exports.signToken = (expiresIn, { id, role }) =>
	new Promise((resolve, reject) => {
		jwt.sign(
			{ id, role },
			process.env.JWT_SECRET,
			{ expiresIn },
			function (err, token) {
				if (err) {
					reject(err);
				} else {
					resolve(token);
				}
			}
		);
	});

exports.verifyToken = (token) =>
	new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, function (err, payload) {
			if (err) {
				reject(err);
			} else {
				resolve(payload);
			}
		});
	});

exports.decodeToken = (token) => jwt.decode(token);
