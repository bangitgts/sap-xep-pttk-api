const express = require("express");
const router = express.Router();
const roomController = require("../app/controllers/RoomController");
const checkToken = require("../auth/checkToken");

// [GET] Room
router.get("/", checkToken, roomController.getRoom);
// [POST] Room
router.post("/add", checkToken, roomController.addRoom);
// [PUT] Change Name Room
router.put("/changename/:_id", checkToken, roomController.changeNameroom);
// [PUT] Change Capacity
router.put("/changecapacity/:_id", checkToken, roomController.changeCapital);
// [DELEROOM] Delete Room
router.delete("/delete/:_id", checkToken, roomController.deleteroom);

module.exports = router;