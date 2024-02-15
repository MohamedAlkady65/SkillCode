const router = require("express").Router();
const multer = require("multer");
const AuthController = require("../controllers/AuthController.js");
const SchoolsController = require("../controllers/SchoolsController.js");
router
	.route("/")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1, 2),
		SchoolsController.getSchool
	)
	.post(
		AuthController.protectRoute,
		AuthController.restrictTo(1),
		SchoolsController.uploadLogo,
		SchoolsController.addSchool
	);

router
	.route("/:id")
	.get(
		AuthController.protectRoute,
		AuthController.restrictTo(1),
		SchoolsController.getSchoolById
	)
	// .delete(
	// 	AuthController.protectRoute,
	// 	AuthController.restrictTo(1),
	// 	SchoolsController.deleteSchoolById
	// );

router.patch(
	"/:id?",
	AuthController.protectRoute,
	AuthController.restrictTo(1, 2),
	SchoolsController.uploadLogo,
	SchoolsController.editSchoolById
);

module.exports = router;
