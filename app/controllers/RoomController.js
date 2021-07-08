const RoomModel = require("../../models/Room.js");

class RoomController {
    // [GET] room
    getRoom(req, res) {
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
        }
        // [POST] Add Room
    addRoom(req, res) {
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
        }
        // [PUT] Change Name Room
    changeNameroom(req, res) {
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
        }
        // [PUT] Change Capital
    changeCapital(req, res) {
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
        }
        // [DELETE] Room
    deleteroom(req, res) {
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
    }
}

module.exports = new RoomController();