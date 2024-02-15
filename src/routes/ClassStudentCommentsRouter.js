const AuthController = require("../controllers/AuthController");
const ClassStudentCommentsController = require("../controllers/ClassStudentCommentsController");

const router = require("express").Router({ mergeParams: true });

router
	.route("/classes/:classId/students/:studentId")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		ClassStudentCommentsController.get
	)
	.post(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		ClassStudentCommentsController.add
	);

router
	.route("/:id")
	.delete(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		ClassStudentCommentsController.delete
	);

module.exports = router;
