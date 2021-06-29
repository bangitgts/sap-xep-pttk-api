const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/PTTK_296", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const Schema = mongoose.Schema;
const RoomSchema = new Schema({
    nameRoom: String,
    capacity: Number,
    lichhoc: Array
        // 3 loai phong
        // phong 20: capacity = 20
        // phong 30: capacity = 30
        // phong 40: capacity = 40
}, {
    collection: "room",
});
const RoomModel = mongoose.model("room", RoomSchema);
module.exports = RoomModel;