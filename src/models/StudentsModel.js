const db = require("../db.js");

const age = `FLOOR(DATEDIFF(CURDATE(), birth_day) /365.25) AS age`;

class StudentsModel {
	static async checkStudentInSchool(studentId) {
		const sql = "SELECT school FROM students WHERE id = ?";
		const values = [studentId];

		const [result] = await db.query(sql, values);

		return result;
	}

	static checkNationalIdExists = async (national_id) => {
		const sql =
			"SELECT IF(COUNT(*)>0,true,false) as national_id FROM students WHERE national_id= ?";
		const values = [national_id];

		const [result] = await db.query(sql, values);
		return result;
	};

	static async getAllStudents(queryString) {
		const sql = `SELECT s.id, s.name , s.national_id , s.gender, s.parent_phone, s.birth_day , ${age} , s.photo, s.school as school_id , sc.name as school_name  
        FROM students s 
        INNER JOIN schools sc on s.school = sc.id 
        WHERE s.active = true ${queryString}`;

		const [students] = await db.query(sql);

		return students;
	}

	static getNumberOfStudents = async () => {
		const sql = `SELECT COUNT(s.id) as count
        FROM students s 
        INNER JOIN schools sc on s.school = sc.id 
        WHERE s.active = true`;

		const [result] = await db.query(sql);
		return result;
	};

	static async deleteStudentById(id) {
		const sql = `UPDATE students SET active = false WHERE active = true AND id = ?`;
		const values = [id];
		const [result] = await db.query(sql, values);

		return result;
	}

	static async getStudentById(id) {
		const sql = `SELECT s.id, s.name , s.national_id , s.gender, s.parent_phone, s.birth_day , ${age} , s.photo, s.school as school_id ,sc.name as school_name  
        FROM students s 
        INNER JOIN schools sc on s.school = sc.id 
        WHERE s.active = true AND s.id = ?`;

		const values = [id];

		const [students] = await db.query(sql, values);

		return students;
	}
	static async getStudentByNationalId(id) {
		const sql = `SELECT s.id, s.name , s.national_id , s.gender, s.parent_phone, s.birth_day , ${age} , s.photo, s.school as school_id ,sc.name as school_name  
        FROM students s 
        INNER JOIN schools sc on s.school = sc.id 
        WHERE s.active = true AND s.national_id = ?`;

		const values = [id];

		const [students] = await db.query(sql, values);

		return students;
	}

	static async addStudent(student) {
		const sql = `INSERT INTO students ( name, national_id, birth_day, gender, photo, parent_phone,school) 
        VALUES (?,?,?,?,?,?,?)`;

		const valuse = [
			student.name,
			student.national_id,
			student.birth_day,
			student.gender,
			student.photo,
			student.parent_phone,
			student.school,
		];

		const [result] = await db.query(sql, valuse);
		return result.insertId;
	}

	static editStudentById = async (student, id) => {
		const sql = `UPDATE students SET ? WHERE active=true AND id = ?`;
		const values = [student, id];
		const [result] = await db.query(sql, values);

		return result;
	};

	static checkExists = async (id) => {
		const sql = `SELECT COUNT(id) as count FROM students WHERE id = ? AND active = 1`;
		const values = [id];
		const [result] = await db.query(sql, values);
		return result;
	};
}

module.exports = StudentsModel;
