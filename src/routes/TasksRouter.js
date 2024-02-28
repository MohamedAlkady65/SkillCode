const AuthController = require("../controllers/AuthController");
const TasksController = require("../controllers/TasksController");
const router = require("express").Router({ mergeParams: true });

router
	.route("/")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		TasksController.getOfSession
	)
	.post(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		TasksController.uploadImages,
		TasksController.add
	)
	.delete(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		TasksController.delete
	);

module.exports = router;
