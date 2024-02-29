const AuthController = require("../controllers/AuthController");
const CoursesController = require("../controllers/CoursesController");

const router = require("express").Router();

router.use(AuthController.protectRoute);

router
	.route("/")
	.get(AuthController.restrictTo(1, 2), CoursesController.getAllCourses)
	.post(AuthController.restrictTo(1), CoursesController.addCourse);

router.get(
	"/list",
	AuthController.restrictTo(1, 2),
	CoursesController.getListOfCourses
);

router
	.route("/:id")
	.get(AuthController.restrictTo(1, 2, 3), CoursesController.getCourseById)
	.all(AuthController.restrictTo(1))
	.patch(CoursesController.editCourseById)
	.delete(CoursesController.deleteCourseById);

module.exports = router;
