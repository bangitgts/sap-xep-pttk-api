const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/PTTK_296", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
    nameCourse: String,
    schedule: String, // 2-4-6 = 2; 3-5-7 = 1; full tuan = 0
    during: Number, // 2 tuan = 2, 3 tuan = 3
    amount: Number, // so luong hoc vien 
    isCheck: Number,
    createDate: String,
}, {
    collection: "course",
});
const CourseModel = mongoose.model("course", CourseSchema);
module.exports = CourseModel;