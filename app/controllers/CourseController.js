const CourseModel = require("../../models/Course.js");
const RoomModel = require("../../models/Room.js");

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

class CourseController {
    // [GET] test
    getTest(req, res, next) {
            res.status(200).json({
                status: 200,
                success: true,
                message: "Return the course",
                data: data,
            });
        }
        //[GET] Course
    getCourse(req, res) {
            CourseModel.find({})
                .select("-__v")
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
        }
        // [GET /] coursed
    getCoursed(req, res) {
            CourseModel.find({
                    isCheck: 2,
                })
                .select("-__v")
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
        }
        // [POST] Add Course
    addCourse(req, res) {
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
        }
        // [PUT] Change Name Course
    changeNameCourse(req, res) {
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
        }
        // [PUT] Change schedule Course
    changeSchedulecourse(req, res) {
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
    }

    // [PUT] Change During Course
    changeDuringcourse(req, res) {
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
        }
        // [PUT] Change Amount Course
    changeAmountcourse(req, res) {
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
        }
        // [DELETE] Delete Course
    deleteCourse(req, res) {
            const _id = req.params._id;
            CourseModel.deleteOne({
                    $or: [
                        { _id: _id, isCheck: 0 },
                        { _id: _id, isCheck: 1 },
                    ],
                })
                .then((data) => {
                    if (data.deletedCount === 1) {
                        res.status(200).json({
                            status: 200,
                            success: true,
                            message: "Delete Successfully",
                        });
                    } else {
                        res.status(403).json({
                            status: 403,
                            success: true,
                            message: "This course is scheduled, cannot be deleted",
                        });
                    }
                })
                .catch((err) =>
                    res.status(402).json({
                        status: 402,
                        success: true,
                        message: "No valid room found",
                    })
                );
        }
        // [PUT] Change Course isCheck
    changeIscheck(req, res) {
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
        }
        // [POST] SAPXEP
    scheduleClass(req, res) {
        CourseModel.find({ isCheck: 1 })
            .then((data) => {
                let course20 = [];
                let course30 = [];
                let course40 = [];

                for (let item of data) {
                    if (item.amount <= 20) {
                        course20.push(item);
                        item.isCheck = 2;
                        item.save();
                    } else if (item.amount > 20 && item.amount <= 30) {
                        course30.push(item);
                        item.isCheck = 2;
                        item.save();
                    } else {
                        course40.push(item);
                        item.isCheck = 2;
                        item.save();
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
                                item.remove();
                            } else if (item.capacity === 30) {
                                room30.push(item);
                                item.remove();
                            } else {
                                room40.push(item);
                                item.remove();
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

                        xeplop(room20, course20);

                        xeplop(room30, course30);

                        xeplop(room40, course40);
                        const room = room20.concat(room30, room40);
                        for (let item of room) {
                            RoomModel.create({
                                nameRoom: item.nameRoom,
                                capacity: item.capacity,
                                lichchan: item.lichchan,
                                lichle: item.lichle,
                            });
                        }
                        res.status(200).json({
                            status: 200,
                            success: true,
                            message: "Successfully",
                        });
                    });
            });
    }
}

module.exports = new CourseController();