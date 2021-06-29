//import
const express = require("express");
const app = express();
const port = 4000;
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
app.post("/add-room", checkToken, (req, res, next) => {
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

app.post("/add-course", (req, res, next) => {
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

//start
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});