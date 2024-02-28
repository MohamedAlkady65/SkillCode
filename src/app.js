const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const GlobalErrorHandler = require("./controllers/ErrorController.js");
const AppError = require("./utils/appError.js");
const AuthRouter = require("./routes/AuthRouter.js");
const SchoolsRouter = require("./routes/SchoolsRouter.js");
const TeachersRouter = require("./routes/TeachersRouter.js");
const CoursesRouter = require("./routes/CoursesRouter.js");
const StudentsRouter = require("./routes/StudentsRouter.js");
const ClassesRouter = require("./routes/ClassesRouter.js");
const ClassStudentCommentsRouter = require("./routes/ClassStudentCommentsRouter.js");
const SessionsRouter = require("./routes/SessionsRouter.js");
const ReportsRouter = require("./routes/ReportsRouter.js");

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.ENV == "development") {
	app.use(morgan("dev"));
}

app.use("/", AuthRouter);
app.use("/schools", SchoolsRouter);
app.use("/teachers", TeachersRouter);
app.use("/courses", CoursesRouter);
app.use("/students", StudentsRouter);
app.use("/classes", ClassesRouter);
app.use("/classStudentComments", ClassStudentCommentsRouter);
app.use("/sessions", SessionsRouter);
app.use("/reports", ReportsRouter);

app.all("*", (req, res, next) => {
	next(
		new AppError(
			`Route ${req.originalUrl} with method ${req.method} is not found`,
			404
		)
	);
});

app.use(GlobalErrorHandler);

module.exports = app;
