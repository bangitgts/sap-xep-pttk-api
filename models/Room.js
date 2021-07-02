const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/PTTK_296", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const Schema = mongoose.Schema;
const RoomSchema = new Schema({
    nameRoom: String,
    capacity: Number,
    lichchan: Array,
    lichle: Array
}, {
    collection: "room",
});
const RoomModel = mongoose.model("room", RoomSchema);
module.exports = RoomModel;