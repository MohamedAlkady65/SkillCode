const db = require("../db");
class CoursesModel {
	static async getAllCourses(queryString) {
		const sql = `SELECT id , title ,description  FROM courses WHERE active=true ${queryString}`;
		const [courses] = await db.query(sql);
		return courses;
	}
	static getNumberOfCourses = async (queryString) => {
		const sql = `SELECT COUNT(id) as count FROM courses WHERE active=true ${queryString}`;
		const [result] = await db.query(sql);
		return result;
	};
	static async getListOfCourses() {
		const sql = `SELECT id , title FROM courses WHERE active=true ORDER BY title`;
		const [courses] = await db.query(sql);
		return courses;
	}
	static async getCourseById(id) {
		const sql = `SELECT title, description  FROM courses WHERE id = ? AND active=true `;
		const values = [id];
		const [courses] = await db.query(sql, values);
		return courses;
	}
	static async getCourseAttributeById(id) {
		const sql = `SELECT id , attribute FROM course_report_attributes WHERE course_id = ? AND active=true `;
		const values = [id];
		const [attributes] = await db.query(sql, values);
		return attributes;
	}
	static async addCourse({ transactionConnection, course }) {
		const sql = `INSERT INTO courses (title,description) VALUES(?,?)`;
		const values = [course.title, course.description];
		const [result] = await transactionConnection.query(sql, values);
		return result;
	}
	static async addCourseReportAttribute({
		transactionConnection,
		courseId,
		attributes,
	}) {
		const sql = `INSERT INTO course_report_attributes(course_id, attribute) VALUES ?`;
		const values = [attributes.map((attr) => [courseId, attr])];
		await transactionConnection.query(sql, values);
	}

	static editCourseById = async (course, id) => {
		const sql = `UPDATE courses SET ? WHERE active = true AND id = ? `;
		const values = [course, id];
		const [result] = await db.query(sql, values);
		return result;
	};
	static deleteCourseById = async (id) => {
		const sql = `UPDATE courses SET active = false WHERE active = true AND id = ? `;
		const values = [id];
		const [result] = await db.query(sql, values);
		return result;
	};

	static async getCourseAttributeByClassId(classId) {
		const sql = `SELECT id , attribute FROM course_report_attributes 
		WHERE course_id = (SELECT  course_id FROM classes WHERE id = ?) AND active=true `;
		const values = [classId];
		const [attributes] = await db.query(sql, values);
		return attributes;
	}
	static checkExists = async (id) => {
		const sql = `SELECT COUNT(id) as count FROM courses WHERE id = ? AND active = true`;
		const values = [id];
		const [result] = await db.query(sql, values);
		return result;
	};
}

module.exports = CoursesModel;
