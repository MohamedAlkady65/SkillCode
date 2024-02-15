const UsersModel = require("../models/UsersModel");
const { hashPassword, compareHashedPassword } = require("../utils/encrypt.js");
const TokensServices = require("./TokensServices.js");
const AppError = require("../utils/appError.js");
const caltTime = require("../utils/caltTime.js");

class UsersServices {
	constructor() {}

	static async login({ email, password }) {
		const wrongData = () => {
			throw new AppError("Email or password is incorrect", 400);
		};

		const results = await UsersModel.login(email);

		if (results.length === 0) return wrongData();

		const user = results[0];

		const hashedPassword = user.password;

		const passwordIsCorrect = await compareHashedPassword(
			password,
			hashedPassword
		);

		if (!passwordIsCorrect) return wrongData();

		delete user.password;

		if (user.active == true) {
			await TokensServices.addLoginToken(user);
		} else if (user.active == false) {
			await TokensServices.addChangePasswordActivationToken(user);
		}

		return user;
	}

	static async addUser(transactionConnection, { email, password, role }) {
		const hashedPassword = await hashPassword(password);

		await UsersModel.addUser(transactionConnection, {
			email: email,
			password: hashedPassword,
			role: role,
		});
	}

	static async changePasswordActivation({ token, password }) {
		const user = await TokensServices.verifyChangePasswordActivationToken(
			token
		);

		await TokensServices.deleteChangePasswordActivationToken(user.id);

		await this.UpdatePasswordById({
			userId: user.id,
			password: password,
			activation: true,
		});

		await TokensServices.addLoginToken(user);

		return user;
	}

	static async UpdatePasswordById({ userId, password, activation = false }) {
		const hashedPassword = await hashPassword(password);

		await UsersModel.UpdatePasswordById({
			userId: userId,
			password: hashedPassword,
			activation: activation,
		});
	}

	static checkEmailExists = async (email) => {
		const result = await UsersModel.checkEmailExists(email);

		return result[0].email_exists > 0;
	};
}

module.exports = UsersServices;
