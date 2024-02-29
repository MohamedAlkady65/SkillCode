const router = require("express").Router();
const AuthController = require("../controllers/AuthController.js");
const SchoolsController = require("../controllers/SchoolsController.js");

router.use(AuthController.protectRoute);

router
	.route("/")
	.all(AuthController.restrictTo(1))
	.get(SchoolsController.getAll)
	.post(SchoolsController.uploadLogo, SchoolsController.add);

router.get("/list", AuthController.restrictTo(1), SchoolsController.getList);
router
	.route("/me")
	.all(AuthController.restrictTo(2))
	.get(SchoolsController.getMe)
	.patch(SchoolsController.uploadLogo, SchoolsController.editMe);
	
router
	.route("/:id")
	.all(AuthController.restrictTo(1))
	.get(SchoolsController.getById)
	.patch(SchoolsController.uploadLogo, SchoolsController.editById);

module.exports = router;
