const AuthController = require("../controllers/AuthController");
const ClassStudentCommentsController = require("../controllers/ClassStudentCommentsController");

const router = require("express").Router({ mergeParams: true });

router
	.route("/")
	.get(ClassStudentCommentsController.get)
	.post(ClassStudentCommentsController.add);

router
	.route("/:id")
	.delete(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		ClassStudentCommentsController.authorizeComment,
		ClassStudentCommentsController.delete
	);

module.exports = router;
