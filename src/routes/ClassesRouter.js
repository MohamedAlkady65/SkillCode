const AuthController = require("../controllers/AuthController");
const ClassesController = require("../controllers/ClassesController");
const ClassesStudentsRouter = require("../routes/ClassesStudentsRouter");

const router = require("express").Router();

router.use(AuthController.protectRoute);

router
	.route("/")
	.post(AuthController.restrictTo(1, 2), ClassesController.add)
	.get(AuthController.restrictTo(1, 2, 3), ClassesController.getAll);

router.use(
	AuthController.restrictTo(1, 2, 3),
	ClassesController.authorizeClass
);

router
	.route("/:id")
	.get(ClassesController.getById)
	.patch(ClassesController.editById)
	.delete(ClassesController.deleteById);

router.use("/:classId/students", ClassesStudentsRouter);

module.exports = router;
