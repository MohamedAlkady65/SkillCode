const db = require("../db.js");

class TeachersModel {
	static async getSchoolOfTeacher(teacherId) {
		const sql = "SELECT school FROM teachers WHERE id = ?";
		const values = [teacherId];

		const [result] = await db.query(sql, values);

		return result;
	}

	static checkNationalIdExists = async (national_id) => {
		const sql =
			"SELECT IF(COUNT(*)>0,true,false) as national_id FROM teachers WHERE national_id= ?";
		const values = [national_id];

		const [result] = await db.query(sql, values);
		return result;
	};

	static async getAllTeachers(queryString) {
		const sql = `SELECT t.id, u.email, t.national_id, t.name, t.gender, t.phone, t.photo, t.school as school_id ,s.name as school_name  
        FROM teachers t 
        INNER JOIN users u on t.user_id = u.id 
        LEFT OUTER JOIN schools s on t.school = s.id 
        WHERE 1=1 ${queryString}`;

		const [teachers] = await db.query(sql);

		return teachers;
	}

	static getNumberOfTeachers = async () => {
		const sql = `SELECT COUNT(t.id) as count FROM teachers t 
        INNER JOIN users u on t.user_id = u.id 
        LEFT OUTER JOIN schools s on t.school = s.id 
        `;

		const [result] = await db.query(sql);
		return result;
	};

	static async deleteTeacherById(id) {
		const sql = `UPDATE users u INNER JOIN teachers t on u.id = t.user_id 
		SET u.active = 0 WHERE u.active != 0 AND t.id = ?`;
		const values = [id];
		const [result] = await db.query(sql, values);

		return result;
	}

	static async getTeacherById(id) {
		const sql = `SELECT  t.id, email, national_id, t.name, gender, t.phone, photo, s.id as school_id , s.name as school_name
		FROM teachers t INNER JOIN users u on t.user_id = u.id LEFT OUTER JOIN schools s on s.id = school WHERE  t.id = ?`;

		const values = [id];

		const [teachers] = await db.query(sql, values);

		return teachers;
	}

	static async addTeacher({ teacher, transactionConnection }) {
		const [result] = await transactionConnection.query(
			`INSERT INTO teachers 
			( user_id, national_id, name, gender, phone, photo, school) 
			VALUES ((SELECT id FROM users WHERE email =?),?,?,?,?,?,?)`,
			[
				teacher.email,
				teacher.national_id,
				teacher.name,
				teacher.gender,
				teacher.phone,
				teacher.photo,
				teacher.school,
			]
		);
		return result.insertId;
	}

	static editTeacherById = async (teacher, id) => {
		const sql = `UPDATE users u INNER JOIN teachers t on u.id = t.user_id 
			SET ? WHERE  t.id = ?`;
		const values = [teacher, id];
		const [result] = await db.query(sql, values);

		return result;
	};
	static checkExists = async (id) => {
		const sql = `SELECT COUNT(id) as count FROM teachers WHERE id = ?`;
		const values = [id];
		const [result] = await db.query(sql, values);
		return result;
	};
}

module.exports = TeachersModel;
