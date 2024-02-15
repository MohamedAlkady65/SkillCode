const TokensModel = require("../models/TokensModel.js");
const UsersModel = require("../models/UsersModel.js");
const {
	hashSHA256,
	verifyToken,
	signToken,
	decodeToken,
} = require("../utils/encrypt.js");
const AppError = require("../utils/appError.js");

class TokensServices {
	constructor() {}

	static async addLoginToken(user) {
		const token = await signToken("30d", { id: user.id, role: user.role });
		const hashedToken = await hashSHA256(token);
		await TokensModel.addLoginToken({
			userId: user.id,
			hashedToken: hashedToken,
		});
		user.token = token;
	}

	static async verifyLoginToken(token) {
		try {
			const payload = await verifyToken(token);
			const userId = payload.id;
			const hashedToken = await hashSHA256(token);

			const results = await TokensModel.verifyLoginToken({
				hashedToken: hashedToken,
				userId: userId,
			});

			if (results.length == 0) {
				throw new AppError("Invalid Token", 401);
			}

			const user = results[0];

			user.isAdmin = user.role == 1;
			user.isSchool = user.role == 2;
			user.isTeacher = user.role == 3;

			await getResourceId(user);
			delete user.token;

			return user;
		} catch (error) {
			if (
				[
					"JsonWebTokenError",
					"TokenExpiredError",
					"NotBeforeError",
					"SyntaxError",
				].includes(error.name)
			) {
				throw new AppError("Invalid Token", 401);
			} else {
				throw error;
			}
		}
	}

	static async logout(token) {
		const hashedToken = await hashSHA256(token);
		await TokensModel.removeLoginToken(hashedToken);
	}

	static async addChangePasswordActivationToken(user) {
		const token = await signToken(5 * 60, { id: user.id });
		const hashedToken = await hashSHA256(token);
		await TokensModel.addChangePasswordActivationToken({
			userId: user.id,
			hashedToken: hashedToken,
		});
		user.changePasswordActivationToken = token;
	}

	static async verifyChangePasswordActivationToken(token) {
		try {
			const payload = await verifyToken(token);
			const userId = payload.id;
			const hashedToken = await hashSHA256(token);

			const results =
				await TokensModel.verifyChangePasswordActivationToken({
					hashedToken: hashedToken,
					userId: userId,
				});

			if (results.length == 0) {
				throw new Error();
			}

			const user = results[0];
			return user;
		} catch (error) {
			await deleteExpiredChangePasswordActivationToken({ error, token });
			throw new AppError("Invalid Token", 401);
		}
	}

	static async deleteChangePasswordActivationToken(userId) {
		await TokensModel.deleteChangePasswordActivationToken(userId);
	}
}

const deleteExpiredChangePasswordActivationToken = async ({ error, token }) => {
	try {
		if (error.name === "TokenExpiredError") {
			const payload = decodeToken(token);
			const userId = payload.id;
			await TokensServices.deleteChangePasswordActivationToken(userId);
		}
	} catch (error) {}
};

const getResourceId = async (user) => {
	let resourse, key;
	if (user.isSchool) {
		[resourse, key] = ["schools", "school_id"];
	} else if (user.isTeacher) {
		[resourse, key] = ["teachers", "teacher_id"];
	} else {
		return;
	}

	const results = await UsersModel.getResourceId({
		resourse: resourse,
		userid: user.userid,
	});

	if (results.length == 0) {
		throw new Error();
	}

	user[key] = results[0].id;
};

module.exports = TokensServices;
