const accountRouter = require("./accout.route");
const courseRouter = require("./course.route");

function route(app) {
    app.use("/account", accountRouter);
    app.use("/course", courseRouter);
}

module.exports = route;