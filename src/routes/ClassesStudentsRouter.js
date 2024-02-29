const ClassesStudentsController = require("../controllers/ClassesStudentsController");
const ClassStudentCommentsRouter = require("../routes/ClassStudentCommentsRouter");

const router = require("express").Router({ mergeParams: true });

router
	.route("/")
	.get(ClassesStudentsController.getEnrolledStudents)
	.post(ClassesStudentsController.enrollStudents)
	.delete(ClassesStudentsController.removeEnrolledStudents);

router.use("/:studentId/comments", ClassStudentCommentsRouter);

module.exports = router;
