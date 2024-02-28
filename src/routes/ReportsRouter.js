const router = require("express").Router();
const ReportsController = require("../controllers/ReportsController");

router
	.route("/classes/:classId/students/:studentId")
	.post(ReportsController.add);

module.exports = router;
