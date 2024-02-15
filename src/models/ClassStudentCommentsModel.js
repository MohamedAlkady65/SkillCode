const db = require("../db");
class ClassStudentCommentsModel {
	static async get({ classId, studentId }) {
		const sql = `SELECT id, comment, date_time FROM class_student_comments 
        WHERE class_id = ? AND student_id = ? ORDER BY date_time DESC`;
		const values = [classId, studentId];
		const [comments] = await db.query(sql, values);
		return comments;
	}
	static async add(comment) {
		const sql = `INSERT INTO class_student_comments (class_id, student_id, comment) VALUES (?,?,?)`;
		const values = [comment.classId, comment.studentId, comment.comment];
		await db.query(sql, values);
	}
	static async delete(id) {
		const sql = `DELETE FROM class_student_comments WHERE id = ?`;
		const values = [id];
		const [result] = await db.query(sql, values);
		return result;
	}
	static async checkStudentAndClassAndEnrollmentExists({
		classId,
		studentId,
	}) {
		const sql = `SELECT COUNT(s.id) as count FROM students s WHERE s.id = :studentId
        UNION ALL
        SELECT COUNT(c.id) as count FROM classes c WHERE c.id = :classId
        UNION ALL
        SELECT COUNT(ce.class_id) as count FROM class_enrollment ce WHERE ce.class_id = :classId AND ce.student_id = :studentId `;
		const values = { classId, studentId };
		const [result] = await db.query(sql, values);
		return result;
	}
}

module.exports = ClassStudentCommentsModel;
