const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const UsersServices = require("../services/UsersServices.js");
const TokensServices = require("../services/TokensServices.js");
const loginValidation = require("../validations/loginValidation.js");
const changePasswordActivationValidation = require("../validations/changePasswordActivationValidation.js");

const getUserToken = (req) => {
	const auth = req.headers.authorization;

	if (
		!auth ||
		!(typeof auth == "string") ||
		!auth.startsWith("Bearer") ||
		!auth.includes(" ")
	) {
		throw new AppError("No token found", 401);
	}

	const token = auth.split(" ")[1];

	return token;
};

exports.protectRoute = catchAsync(async (req, res, next) => {
	const token = getUserToken(req);

	const user = await TokensServices.verifyLoginToken(token);


	req.user = user;

	next();
});

exports.restrictTo = (...roles) =>
	catchAsync(async (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError("Forbidden, You have not permission", 403)
			);
		}
		next();
	});

const sendLoginToken = (res, user) => {
	const cookieOptions = {
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: true,
	};

	res.cookie("token", user.token, cookieOptions);

	res.status(200).json({
		status: "success",
		token: user.token,
	});
};

const sendChangePasswordActivationToken = (res, user) => {
	res.status(200).json({
		status: "success",
		changePasswordActivationToken: user.changePasswordActivationToken,
	});
};

exports.login = catchAsync(async (req, res, next) => {
	let validatedData = await loginValidation.validate(req.body);
	const user = await UsersServices.login({
		email: validatedData.email,
		password: validatedData.password,
	});

	if (user.active == true) {
		sendLoginToken(res, user);
	} else if (user.active == false) {
		sendChangePasswordActivationToken(res, user);
	}
});

exports.changePasswordActivation = catchAsync(async (req, res, next) => {
	const password = await changePasswordActivationValidation.validate(
		req.body
	);
	const token = req.params.token;

	const user = await UsersServices.changePasswordActivation({
		token: token,
		password: password,
	});
	sendLoginToken(res, user);
});

exports.logout = catchAsync(async (req, res, next) => {
	const token = getUserToken(req);
	await TokensServices.logout(token);
	res.status(200).json({
		status: "success",
		message: "Logout Successfully",
	});
});
