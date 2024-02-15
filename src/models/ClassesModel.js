const db = require("../db");

class ClassesModel {
	static async getAll(queryString) {
		const sql = `
        SELECT 
        cl.id,
        school_id ,s.name as school_name ,
        course_id , co.title as course_title ,
        teacher_id ,t.name as teacher_name ,
        start_date , status 
        FROM classes cl INNER JOIN schools s on school_id = s.id
        INNER JOIN courses co on course_id = co.id 
        INNER JOIN teachers t on teacher_id = t.id
        WHERE 1=1 ${queryString}`;

		const [classes] = await db.query(sql);

		return classes;
	}
	static async getNumber() {
		const sql = `
        SELECT 
        COUNT(cl.id) as count
        FROM classes cl INNER JOIN schools s on school_id = s.id
        INNER JOIN courses co on course_id = co.id 
        INNER JOIN teachers t on teacher_id = t.id`;

		const [result] = await db.query(sql);

		return result;
	}

	static async getById(id) {
		const sql = `SELECT 
        cl.id,
        school_id ,s.name as school_name ,
        course_id , co.title as course_title ,
        teacher_id ,t.name as teacher_name ,
        start_date , status 
        FROM classes cl INNER JOIN schools s on school_id = s.id
        INNER JOIN courses co on course_id = co.id 
        INNER JOIN teachers t on teacher_id = t.id
        WHERE cl.id = ?`;
		const values = [id];
		const [classes] = await db.query(sql, values);

		return classes;
	}

	static async add(class_) {
		const sql = `INSERT INTO classes(school_id, course_id, teacher_id, start_date) VALUES (?,?,?,?)`;
		const values = [
			class_.school_id,
			class_.course_id,
			class_.teacher_id,
			class_.start_date,
		];
		await db.query(sql, values);
	}
	static async editById(class_id, class_) {
		const sql = `UPDATE classes SET ? WHERE id = ?`;
		const values = [class_, class_id];
		const [result] = await db.query(sql, values);
		return result;
	}
	static async deleteById(class_id) {
		const sql = `DELETE FROM classes WHERE id = ?`;
		const values = [class_id];
		const [result] = await db.query(sql, values);
		return result;
	}

	static async enrollStudents(classId, students) {
		const sql = `
		INSERT IGNORE INTO class_enrollment (class_id,student_id) 
		SELECT ? as class_id , id as student_id  FROM students 
		WHERE school = (SELECT school_id FROM classes WHERE id = ? ) AND id IN (?)
		`;
		const values = [classId, classId, students];
		await db.query(sql, values);
	}

	static async removeEnrolledStudents(classId, students) {
		const sql = `DELETE FROM class_enrollment WHERE class_id = ? AND student_id IN (?)`;
		const values = [classId, students];
		await db.query(sql, values);
	}

	static async getEnrolledStudents(classId, queryString) {
		const sql = `SELECT s.id , name FROM class_enrollment c 
		INNER JOIN students s on student_id = s.id WHERE c.class_id = ? ${queryString}`;
		const values = [classId];
		const [students] = await db.query(sql, values);
		return students;
	}
	static async getEnrolledStudentsNumber(classId) {
		const sql = `SELECT COUNT(s.id) as count FROM class_enrollment c 
		INNER JOIN students s on student_id = s.id WHERE c.class_id = ?`;
		const values = [classId];
		const [result] = await db.query(sql, values);
		return result;
	}
	static checkExists = async (id) => {
		const sql = `SELECT COUNT(id) as count FROM classes WHERE id = ?`;
		const values = [id];
		const [result] = await db.query(sql, values);
		return result;
	};

	static async getSchoolOfClass(classId) {
		const sql = "SELECT school_id FROM classes WHERE id = ?";
		const values = [classId];

		const [result] = await db.query(sql, values);

		return result;
	}
}

module.exports = ClassesModel;
