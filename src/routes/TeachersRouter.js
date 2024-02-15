const router = require("express").Router();
const AuthController = require("../controllers/AuthController.js");
const TeachersController = require("../controllers/TeachersController.js");

router
	.route("/")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2, 3),
		TeachersController.getTeacher
	)
	.post(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		TeachersController.uploadPhoto,
		TeachersController.addTeacher
	);

router
	.route("/:id")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		TeachersController.checkTeacherInSchool,
		TeachersController.getTeacherById
	)
	// .delete(
	// 	AuthController.protectRoute,
	// 	AuthController.restrictTo(1, 2),
	// 	TeachersController.checkTeacherInSchool,
	// 	TeachersController.deleteTeacherById
	// );

router.patch(
	"/:id?",
	AuthController.protectRoute,
	AuthController.restrictTo(1, 2, 3),
	TeachersController.checkTeacherInSchool,
	TeachersController.uploadPhoto,
	TeachersController.editTeacherById
);

module.exports = router;
