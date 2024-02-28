const SchoolsModel = require("../models/SchoolsModel.js");
const db = require("../db.js");
const ApiFeatures = require("../utils/ApiFeatures.js");
const AppError = require("../utils/appError.js");
const UsersServices = require("./UsersServices.js");
const handleWhatsappPhone = require("../utils/handleWhatsappPhone.js");
const sharpHandler = require("../utils/sharpHandler.js");

class SchoolsServices {
	static addSchool = async (school, logo) => {
		handleWhatsappPhone(school);

		const transactionConnection = await db.transactionConnection();

		await transactionConnection.run(async () => {
			await UsersServices.addUser(transactionConnection, {
				email: school.email,
				password: school.email,
				role: 2,
			});
			school.logo = await saveLogo(logo);
			console.log(logo);
			await SchoolsModel.addSchool({
				school: school,
				transactionConnection: transactionConnection,
			});
		});
	};

	static getAllSchools = async (query) => {
		const features = new ApiFeatures(query);

		const [queryString, queryStringForCount] = features
			.filter(["country", "city"])
			.sort(["name", "country", "city", "join_date"])
			.search(["name"])
			.pagination()
			.query();

		const schools = await SchoolsModel.getAllSchools(queryString);

		if (!features.page) return { schools };

		const result = await SchoolsModel.getNumberOfSchools(
			queryStringForCount
		);
		const pagesCount = Math.ceil(result[0].count / features.limit);

		return { pagesCount, schools };
	};
	static getListOfSchools = async () => {
		const schools = await SchoolsModel.getListOfSchools();
		return schools;
	};

	static getSchoolById = async (id) => {
		const schools = await SchoolsModel.getSchoolById(id);

		if (schools.length == 0) {
			throw new AppError("School not found", 404);
		}

		return schools[0];
	};

	static deleteSchoolById = async (id) => {
		const result = await SchoolsModel.deleteById(id);

		if (result.affectedRows == 0) {
			throw new AppError("School not found", 404);
		}
	};
	static editSchoolById = async (school, id, logo) => {
		handleWhatsappPhone(school);

		const transactionConnection = await db.transactionConnection();

		const result = await transactionConnection.run(async () => {
			school.logo = await saveLogo(logo);

			const result = await SchoolsModel.editSchoolById(
				transactionConnection,
				school,
				id
			);
			return result;
		});

		if (result.affectedRows == 0) {
			throw new AppError("School not found", 404);
		}
	};

	static checkExists = async (id) => {
		const result = await SchoolsModel.checkExists(id);
		return result[0].count > 0;
	};
}
const saveLogo = async (file) => {
	if (file) {
		const random = Math.floor(Math.random() * 1000 * Date.now());
		const name = `school-${random}.jpeg`;

		await sharpHandler({
			file: file,
			path: `public/images/schools/${name}`,
		});
		return name;
	}
};
module.exports = SchoolsServices;
