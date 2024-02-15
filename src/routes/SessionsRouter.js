const AuthController = require("../controllers/AuthController");
const SessionsController = require("../controllers/SessionsController");
const TasksRouter = require("./TasksRouter");
const router = require("express").Router();

router.use("/:sessionId/tasks", TasksRouter);

router
	.route("/classes/:classId")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		SessionsController.getOfClass
	)
	.post(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		SessionsController.add
	);

router
	.route("/:id")
	.delete(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		SessionsController.delete
	);

module.exports = router;
