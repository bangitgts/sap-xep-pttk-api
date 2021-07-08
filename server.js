//import
const express = require("express");
const app = express();
const port = 5000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const checkToken = require("./auth/checkToken");
const CourseModel = require("./models/Course");
const RoomModel = require("./models/Room");

const route = require("./routes/index.js");
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

function xeplop(rooms, course20) {
    let tempChan = []; // kiểm tra rooms nao trong phong
    let tempLe = []; // kiểm tra rooms nao trong phong
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
    for (let i = 0; i < rooms.length; i++) {
        for (let j = 0; j < rooms[i].lichle.length; j++) {
            const c = Object.getOwnPropertyNames(rooms[i].lichle[j]).length;
            if (c === 1) {
                const itemAdd = {
                    nameRoom: rooms[i].nameRoom,
                    indexPhong: i,
                    lichleArrayIndex: j,
                    during: rooms[i].lichle[j].during,
                };
                tempLe.push(itemAdd);
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
                    rooms[duringInChan.indexPhong].lichchan.splice(
                        duringInChan.lichchanArrayIndex,
                        1
                    );
                    rooms[duringInChan.indexPhong].lichchan.splice(
                        duringInChan.lichchanArrayIndex,
                        0,
                        findChan
                    );
                    removeA(course20, findChan);
                } else {
                    rooms[duringInChan.indexPhong].lichchan.splice(
                        duringInChan.lichchanArrayIndex,
                        1
                    );
                    const addThem = { during: duringInChan.during - findChan.during };
                    rooms[duringInChan.indexPhong].lichchan.splice(
                        duringInChan.lichchanArrayIndex,
                        0,
                        addThem,
                        findChan
                    );
                    removeA(course20, findChan);
                }
            }
        }

        if (findLe !== undefined) {
            const duringInLe = tempLe.find((el) => el.during >= findLe.during);
            if (duringInLe === undefined) {
                rooms.sort(function(a, b) {
                    return (
                        a.lichle.reduce((a, b) => a + b.during, 0) -
                        b.lichle.reduce((a, b) => a + b.during, 0)
                    );
                });
                rooms[0].lichle.push(findLe);
                removeA(course20, findLe);
            } else if (
                duringInLe !== undefined &&
                duringInLe.during >= findLe.during
            ) {
                if (duringInLe.during === findLe.during) {
                    rooms[duringInLe.indexPhong].lichle.splice(
                        duringInLe.lichleArrayIndex,
                        1
                    );
                    rooms[duringInLe.indexPhong].lichle.splice(
                        duringInLe.lichleArrayIndex,
                        0,
                        findLe
                    );
                    removeA(course20, findLe);
                } else {
                    rooms[duringInLe.indexPhong].lichle.splice(
                        duringInLe.lichleArrayIndex,
                        1
                    );
                    const addThem = { during: duringInLe.during - findLe.during };
                    rooms[duringInLe.indexPhong].lichle.splice(
                        duringInLe.lichleArrayIndex,
                        0,
                        addThem,
                        findLe
                    );
                    removeA(course20, findLe);
                }
            }
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
            if (le === chan) {
                rooms[0].lichle.push(findFull);
                rooms[0].lichchan.push(findFull);
                removeA(course20, findFull);
            }
        }
    }
    return rooms;
}

route(app);

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
                    lichchan: [],
                    lichle: [],
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



//
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


//start
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});