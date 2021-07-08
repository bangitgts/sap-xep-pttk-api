const express = require("express");
const router = express.Router();
const courseController = require("../app/controllers/CourseController");
const checkToken = require("../auth/checkToken");

router.get("/", checkToken, courseController.getCourse);
router.post("/addcourse", checkToken, courseController.addCourse);
router.put("/changename/:_id", checkToken, courseController.changeNameCourse);
router.put(
    "/changeschedule/:_id",
    checkToken,
    courseController.changeSchedulecourse
);
router.put(
    "/changeduring/:_id",
    checkToken,
    courseController.changeDuringcourse
);
router.put(
    "/changeamount/:_id",
    checkToken,
    courseController.changeAmountcourse
);
router.put("/changeischeck/:_id", checkToken, courseController.changeIscheck);
router.delete("/delete/:_id", checkToken, courseController.deleteCourse);
router.post("/scheduleclass", checkToken, courseController.scheduleClass);

module.exports = router;