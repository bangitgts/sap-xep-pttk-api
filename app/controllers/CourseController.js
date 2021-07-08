const CourseModel = require("../../models/Course.js");
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
}

module.exports = new CourseController();