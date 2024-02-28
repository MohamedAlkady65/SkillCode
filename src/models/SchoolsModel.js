const db = require("../db.js");

class SchoolsModel {
	constructor() {}
	static getAllSchools = async (queryString) => {
		const sql = `SELECT  s.id , email , name, country,city, phone,logo 
			FROM schools s INNER JOIN users u on s.user_id = u.id WHERE 1=1 ${queryString}`;
		const [schools] = await db.query(sql);
		return schools;
	};
	static getListOfSchools = async () => {
		const sql = `SELECT  s.id , name
			FROM schools s INNER JOIN users u on s.user_id = u.id ORDER BY name`;
		const [schools] = await db.query(sql);
		return schools;
	};
	static getNumberOfSchools = async (queryString) => {
		const sql = `SELECT COUNT(s.id) as count FROM schools s 
		INNER JOIN users u on s.user_id = u.id
		WHERE 1=1 ${queryString} `;

		console.log(sql);
		const [result] = await db.query(sql);
		return result;
	};

	static addSchool = async ({ school, transactionConnection }) => {
		await transactionConnection.query(
			`INSERT INTO schools 
					(user_id, name, country, city, street, site, phone, whatsapp, facebook, instagram, about, logo) 
					VALUES ((SELECT id FROM users WHERE email =?),?,?,?,?,?,?,?,?,?,?,?)`,
			[
				school.email,
				school.name,
				school.country,
				school.city,
				school.street,
				school.site,
				school.phone,
				school.whatsapp,
				school.facebook,
				school.instagram,
				school.about,
				school.logo,
			]
		);
	};

	static getSchoolById = async (id) => {
		const sql = `SELECT s.id, email , name, country,city, street, site , phone ,whatsapp ,facebook ,instagram ,about , join_date ,logo 
			FROM schools s INNER JOIN users u on s.user_id = u.id WHERE  s.id =?`;

		const values = [id];

		const [schools] = await db.query(sql, values);

		return schools;
	};

	static deleteById = async (id) => {
		const sql = `UPDATE users u INNER JOIN schools s on u.id = s.user_id 
			SET u.active = 0 WHERE u.active != 0 AND s.id = ?`;
		const values = [id];
		const [result] = await db.query(sql, values);

		return result;
	};
	static editSchoolById = async (transactionConnection, school, id) => {
		const sql = `UPDATE users u INNER JOIN schools s on u.id = s.user_id 
			SET ? WHERE  s.id = ?`;
		const values = [school, id];
		const [result] = await transactionConnection.query(sql, values);

		return result;
	};
	static checkExists = async (id) => {
		const sql = `SELECT COUNT(id) as count FROM schools WHERE id = ?`;
		const values = [id];
		const [result] = await db.query(sql, values);
		return result;
	};
}

module.exports = SchoolsModel;
