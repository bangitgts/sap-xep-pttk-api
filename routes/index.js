const accountRouter = require("./accout.route");
const courseRouter = require("./course.route");
const roomRouter = require("./room.route");

function route(app) {
    app.use("/account", accountRouter);
    app.use("/course", courseRouter);
    app.use("/room", roomRouter);
}

module.exports = route;