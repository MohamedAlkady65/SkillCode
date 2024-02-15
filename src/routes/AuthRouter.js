const router = require("express").Router();
const AuthController = require("../controllers/AuthController.js");

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post(
	"/changePasswordActivation/:token",
	AuthController.changePasswordActivation
);

module.exports = router;
