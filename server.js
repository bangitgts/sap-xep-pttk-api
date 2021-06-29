//import
const express = require("express");
const app = express();
const port = 5000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const checkToken = require("./auth/checkToken");
const CourseModel = require("./models/Course");
const RoomModel = require("./models/Room");
const AccountAdminModel = require("./models/AccountAdmin");
// app use
//use cors
app.use(cors());
app.use(cookieParser());
app.use(morgan("combined"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Login token
app.post("/account/login", (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    AccountAdminModel.findOne({
            email: email,
            password: password,
        })
        .then((data) => {
            if (data) {
                let token = jwt.sign({
                        _id: data._id,
                    },
                    "password"
                );
                res.header("auth-token", token);

                res.status(200).json({
                    message: "Loggin successfully",
                    data: {
                        email: email,
                        password: password,
                        token: token,
                    },
                    success: true,
                    status: 200,
                });
            } else {
                return res.status(400).json({
                    message: "Loggin failed. Account or password does not match",
                    success: false,
                    status: 400,
                });
            }
        })
        .catch((err) => res.status(500).json(err));
});
// get thong tin account

app.get("/account", checkToken, (req, res, next) => {
    console.log(req.user);
    AccountAdminModel.findOne({
            _id: req.user,
        })
        .then((data) => {
            res.status(200).json({
                status: 200,
                success: true,
                data: {
                    email: data.email,
                },
                message: "Đăng nhập thành công",
            });
        })
        .catch((err) => {
            res.status(500).json({
                status: 500,
                success: false,
                message: "Error from Server",
            });
        });
});

// GET THONG TIN ROOM
app.get("/room", (req, res, next) => {
    RoomModel.find({})
        .select("-__v")
        .then((data) => {
            res.status(200).json({
                status: 200,
                success: true,
                message: "Return the rooms",
                data: data,
            });
        })
        .catch((err) => {
            res.status(500).json({
                status: 500,
                success: false,
                message: "Server error",
            });
        });
});
// get course
app.get("/course", (req, res, next) => {
    CourseModel.find({})
        .select("-__v")
        .select("-isCheck")
        .then((data) => {
            res.status(200).json({
                status: 200,
                success: true,
                message: "Return the course",
                data: data,
            });
        })
        .catch((err) => {
            res.status(500).json({
                status: 500,
                success: false,
                message: "Server error",
            });
        });
});

// ADD ROOM
app.post("/addroom", checkToken, (req, res, next) => {
    let nameRoom = req.body.nameRoom;
    let capacity = req.body.capacity;
    RoomModel.findOne({ nameRoom: nameRoom })
        .then((data) => {
            if (data) {
                res.status(402).json({
                    status: 402,
                    success: false,
                    message: "This room already exists",
                });
            } else {
                RoomModel.create({
                    nameRoom: nameRoom,
                    capacity: capacity,
                });
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Successfully added room",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                status: 500,
                success: false,
                message: "Error coming from servers",
            });
        });
});

// add course

app.post("/addcourse", (req, res, next) => {
    var nameCourse = req.body.nameCourse;
    var schedule = req.body.schedule;
    var during = req.body.during;
    var amount = req.body.amount;
    CourseModel.findOne({ nameCourse: nameCourse })
        .then((data) => {
            if (data) {
                res.status(402).json({
                    status: 402,
                    success: false,
                    message: "This course already exists",
                });
            } else {
                CourseModel.create({
                    nameCourse: nameCourse,
                    schedule: schedule,
                    during: during,
                    amount: amount,
                    isCheck: 0, // 0 la chua khai giaang
                    createDate: new Date().toString(),
                });
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Create success course",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                status: 500,
                success: false,
                message: "Error coming from servers",
            });
        });
});

// sua course
app.put("/changenamecourse/:_id", checkToken, (req, res, next) => {
    const _id = req.params._id;
    const nameCourse = req.body.nameCourse;
    CourseModel.findOne({ nameCourse: nameCourse })
        .then((data) => data)
        .then((data) => {
            if (data)
                res.status(402).json({
                    status: 402,
                    success: false,
                    message: "Named the same as a certain course",
                });
            else {
                CourseModel.findOne({ _id: _id })
                    .then((data) => {
                        data.nameCourse = nameCourse;
                        data.save();
                        res.status(200).json({
                            status: 200,
                            success: true,
                            message: "Successfully renamed course",
                        });
                    })
                    .catch((data) => {
                        res.status(403).json({
                            status: 403,
                            success: false,
                            message: "Invalid course ID",
                        });
                    });
            }
        });
});

// Sua schedule Course
app.put("/changeschedulecourse/:_id", checkToken, (req, res, next) => {
    const _id = req.params._id;
    const schedule = req.body.schedule;
    CourseModel.findOne({ _id: _id, isCheck: 0 })
        .then((data) => {
            data.schedule = schedule;
            data.save();
            res.status(200).json({
                status: 200,
                success: true,
                message: "Successfully changed course time",
            });
        })
        .catch((err) =>
            res.status(402).json({
                status: 402,
                success: true,
                message: "No valid courses found",
            })
        );
});

//
app.put("/changeduringcourse/:_id", checkToken, (req, res, next) => {
    const _id = req.params._id;
    const during = req.body.during;
    CourseModel.findOne({ _id: _id, isCheck: 0 })
        .then((data) => {
            data.during = during;
            data.save();
            res.status(200).json({
                status: 200,
                success: true,
                message: "Successfully changed during time",
            });
        })
        .catch((err) =>
            res.status(402).json({
                status: 402,
                success: true,
                message: "No valid courses found",
            })
        );
});

//
app.put("/changeamountcourse/:_id", checkToken, (req, res, next) => {
    const _id = req.params._id;
    const amount = req.body.amount;
    CourseModel.findOne({ _id: _id, isCheck: 0 })
        .then((data) => {
            data.amount = amount;
            data.save();
            res.status(200).json({
                status: 200,
                success: true,
                message: "Successfully changed amount",
            });
        })
        .catch((err) =>
            res.status(402).json({
                status: 402,
                success: true,
                message: "No valid courses found",
            })
        );
});

app.put("/changenameroom/:_id", checkToken, (req, res, next) => {
    const _id = req.params._id;
    const nameRoom = req.body.nameRoom;
    RoomModel.findOne({ nameRoom: nameRoom })
        .then((data) => data)
        .then((data) => {
            if (data)
                res.status(402).json({
                    status: 402,
                    success: false,
                    message: "Named the same as a certain room",
                });
            else {
                RoomModel.findOne({ _id: _id })
                    .then((data) => {
                        data.nameRoom = nameRoom;
                        data.save();
                        res.status(200).json({
                            status: 200,
                            success: true,
                            message: "Successfully renamed room",
                        });
                    })
                    .catch((data) => {
                        res.status(403).json({
                            status: 403,
                            success: false,
                            message: "Invalid Room ID",
                        });
                    });
            }
        });
});

// change capital
app.put("/changecapacityroom/:_id", checkToken, (req, res, next) => {
    const _id = req.params._id;
    const capacity = req.body.capacity;
    RoomModel.findOne({ _id: _id })
        .then((data) => {
            data.capacity = capacity;
            data.save();
            res.status(200).json({
                status: 200,
                success: true,
                message: "Successfully changed capacity",
            });
        })
        .catch((err) =>
            res.status(402).json({
                status: 402,
                success: true,
                message: "No valid room found",
            })
        );
});

//start
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});