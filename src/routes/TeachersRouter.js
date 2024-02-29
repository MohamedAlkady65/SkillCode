const router = require("express").Router();
const AuthController = require("../controllers/AuthController.js");
const TeachersController = require("../controllers/TeachersController.js");

router.use(AuthController.protectRoute);

router
	.route("/")
	.all(AuthController.restrictTo(1, 2))
	.get(TeachersController.getAll)
	.post(TeachersController.uploadPhoto, TeachersController.add);

router.get(
	"/list/:schooId",
	AuthController.restrictTo(1, 2),
	TeachersController.getListBySchoolId
);

router
	.route("/me")
	.all(AuthController.restrictTo(3))
	.get(TeachersController.getMe)
	.patch(TeachersController.editMe);

router
	.route("/:id")
	.all(
		AuthController.restrictTo(1, 2),
		TeachersController.checkTeacherInSchool
	)
	.get(TeachersController.getById)
	.patch(TeachersController.uploadPhoto, TeachersController.editById);

module.exports = router;
