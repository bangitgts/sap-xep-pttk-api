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

function bubbleSort(array) {
    var size = array.length;
    for (var i = 0; i < size - 1; i++) {
        for (var j = 0; j < size - i - 1; j++) {
            if (array[j].during > array[j + 1].during) {
                var temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            } else if (
                array[j].during === array[j + 1].during &&
                array[j].amount < array[j + 1].amount
            ) {
                var temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
}

function xeplop(room, course) {
    let temp = [];
    for (let item of course) {
        if (item.schedule === "full") {
            const found = room.find(
                (element) =>
                element.fulltuan.length === 0 &&
                element.thuchan.length === 0 &&
                element.thule.length === 0
            );
            found.fulltuan.push(item);
            temp.push(found);
        }
    }

    for (let item of course) {
        try {
            if (item.schedule === "thuchan") {
                const found = room.find(
                    (element) =>
                    element.thuchan.length === 0 && element.fulltuan.length === 0
                );
                found.thuchan.push(item);
                temp.push(found);
            }

            if (item.schedule === "thule") {
                const found = room.find(
                    (element) =>
                    element.thule.length === 0 && element.fulltuan.length === 0
                );
                found.thule.push(item);
                temp.push(found);
            }
        } catch (error) {
            console.log("da tran phong");
        }
    }
    return temp;
}
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
                return res.status(403).json({
                    message: "Loggin failed. Account or password does not match",
                    success: false,
                    status: 403,
                });
            }
        })
        .catch((err) => res.status(500).json(err));
});
// get thong tin account

app.get("/account", checkToken, (req, res, next) => {
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
                    lichhoc: [],
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
                    createDate: new Date().toLocaleString(),
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

// delete room
app.delete("/deleteroom/:_id", checkToken, (req, res, next) => {
    const _id = req.params._id;
    RoomModel.deleteOne({ _id: _id })
        .then((data) => {
            res.status(200).json({
                status: 200,
                success: true,
                message: "Delete Successfully",
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

app.delete("/deletecourse/:_id", checkToken, (req, res, next) => {
    const _id = req.params._id;
    CourseModel.deleteOne({ _id: _id, isCheck: 0 })
        .then((data) => {
            res.status(200).json({
                status: 200,
                success: true,
                message: "Delete Successfully",
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

app.put("/changecourseischeck/:_id", (req, res, next) => {
    const _id = req.params._id;
    CourseModel.findOne({ _id: _id })
        .then((data) => {
            if (data.isCheck === 0) {
                data.isCheck = 1;
                data.save();
            } else if (data.isCheck === 1) {
                data.isCheck = 0;
                data.save();
            }
            res.status(200).json({
                status: 200,
                success: true,
                message: "Change Successfully",
            });
        })
        .catch((err) => {
            res.status(402).json({
                status: 402,
                success: false,
                message: "No Course in data",
            });
        });
});

app.post("/sapxepkhoahoc", (req, res, next) => {
    CourseModel.find({ isCheck: 1 })
        .then((data) => {
            let course20 = [];
            let course30 = [];
            let course40 = [];

            for (let item of data) {
                if (data.amount <= 20) {
                    course20.push(item);
                } else if (data.amount > 20 && data.amount <= 30) {
                    course30.push(item);
                } else {
                    course30.push(item);
                }
            }

            bubbleSort(course20);
            bubbleSort(course30);
            bubbleSort(course40);

            return {
                course20: course20,
                course30: course30,
                course40: course40,
            };
        })
        .then((data) => {
            let c = data;
            RoomModel.find({})
                .then((data) => {
                    let course20 = c.course20;
                    let course30 = c.course30;
                    let course40 = c.course40;
                    let room20 = [];
                    let room30 = [];
                    let room40 = [];
                    for (let item of data) {
                        if (item.capacity === 20) {
                            room20.push(item);
                        } else if (item.capacity === 30) {
                            room30.push(item);
                        } else {
                            room40.push(item);
                        }
                    }

                    return {
                        course20,
                        course30,
                        course40,
                        room20,
                        room30,
                        room40,
                    };
                })
                .then((data) => {
                    let course20 = data.course20;
                    let course30 = data.course30;
                    let course40 = data.course40;
                    let room20 = data.room20;
                    let room30 = data.room30;
                    let room40 = data.room40;
                    res.json(course30);
                });
        });
});

app.get("/test", (req, res, next) => {
    var course20 = [{
        nameCourse: "Bang3",
        schedule: "2",
        during: 2,
    }, ];

    bubbleSort(course20);
    let rooms = [{
            lichchan: [{
                    nameCourse: "Bang1",
                    schedule: "2",
                    during: 2,
                },
                { during: 3 },
            ],
            lichle: [],
            nameRoom: "P01",
            capacity: 20,
        },
        {
            lichchan: [{
                    nameCourse: "Bang2",
                    schedule: "2",
                    during: 2,
                },
                {
                    nameCourse: "Bang12",
                    schedule: "2",
                    during: 2,
                },
                {
                    nameCourse: "Bang13",
                    schedule: "2",
                    during: 2,
                },
                {
                    nameCourse: "Bang14",
                    schedule: "2",
                    during: 2,
                },
            ],
            lichle: [],
            nameRoom: "P03",
            capacity: 20,
        },
    ];

    function removeA(arr) {
        var what,
            a = arguments,
            L = a.length,
            ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }
    let temp = [];
    let tempChan = [];
    for (let i = 0; i < rooms.length; i++) {
        for (let j = 0; j < rooms[i].lichchan.length; j++) {
            const c = Object.getOwnPropertyNames(rooms[i].lichchan[j]).length;
            if (c === 1) {
                const itemAdd = {
                    nameRoom: rooms[i].nameRoom,
                    indexPhong: i,
                    lichchanArrayIndex: j,
                    during: rooms[i].lichchan[j].during,
                };
                tempChan.push(itemAdd);
            }
        }
    }
    while (course20.length !== 0) {
        const findChan = course20.find((el) => el.schedule === "2");
        const findLe = course20.find((el) => el.schedule === "3");
        const findFull = course20.find((el) => el.schedule === "1");

        if (findChan !== undefined) {
            const duringInChan = tempChan.find((el) => el.during >= findChan.during);
            if (duringInChan === undefined) {
                rooms.sort(function(a, b) {
                    return (
                        a.lichchan.reduce((a, b) => a + b.during, 0) -
                        b.lichchan.reduce((a, b) => a + b.during, 0)
                    );
                });
                rooms[0].lichchan.push(findChan);
                removeA(course20, findChan);
            } else if (
                duringInChan !== undefined &&
                duringInChan.during >= findChan.during
            ) {
                if (duringInChan.during === findChan.during) {
                    rooms[duringInChan.indexPhong].lichchan.splice(duringInChan.lichchanArrayIndex, 1);
                    rooms[duringInChan.indexPhong].lichchan.splice(
                        duringInChan.lichchanArrayIndex, 0, findChan
                    );
                    removeA(course20, findChan);
                } else {
                    rooms[duringInChan.indexPhong].lichchan.splice(duringInChan.lichchanArrayIndex, 1);
                    const addThem = { during: (duringInChan.during - findChan.during) };
                    rooms[duringInChan.indexPhong].lichchan.splice(
                        duringInChan.lichchanArrayIndex, 0, addThem, findChan
                    );
                    removeA(course20, findChan);
                }
            }
        }

        if (findLe !== undefined) {
            rooms.sort(function(a, b) {
                return (
                    a.lichle.reduce((a, b) => a + b.during, 0) -
                    b.lichle.reduce((a, b) => a + b.during, 0)
                );
            });
            rooms[0].lichle.push(findLe);
            removeA(course20, findLe);
        }

        if (findFull !== undefined) {
            rooms.sort(function(a, b) {
                return (
                    a.lichchan.length +
                    a.lichle.length -
                    (b.lichchan.length + b.lichle.length)
                );
            });
            const chan = rooms[0].lichchan.reduce((a, b) => a + b.during, 0);
            const le = rooms[0].lichle.reduce((a, b) => a + b.during, 0);
            if (chan > le) {
                const itemDringAdd = {
                    during: chan - le,
                };
                rooms[0].lichle.push(itemDringAdd);
                rooms[0].lichle.push(findFull);
                rooms[0].lichchan.push(findFull);
                removeA(course20, findFull);
            }
            if (le > chan) {
                const itemDringAdd = {
                    during: le - chan,
                };
                rooms[0].lichle.push(findFull);
                rooms[0].lichchan.push(itemDringAdd);
                rooms[0].lichchan.push(findFull);
                removeA(course20, findFull);
            }
        }
    }

    res.json(rooms);
});

//start
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});