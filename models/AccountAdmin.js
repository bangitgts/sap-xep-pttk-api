const mongoose = require('mongoose');
//
mongoose.connect('mongodb://localhost/PTTK_296', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const Schema = mongoose.Schema;
const AccountAdminSchema = new Schema({
    email: String,
    password: String,
    resetToken: String
}, {
    collection: 'accountadmin'
});
const AccountAdminModel = mongoose.model('accountadmin', AccountAdminSchema);
module.exports = AccountAdminModel;