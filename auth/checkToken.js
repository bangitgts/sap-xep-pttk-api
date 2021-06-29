const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header("auth-token"); // sẽ gửi yêu cầu lên header để tìm                                                   token ra rồi verify.
    // Nếu bạn không truyền lên token thì nó sẽ gửi thông báo
    if (!token)
        return res.status(401).send({
            status: 401,
            success: false,
            message: "Please login to access",
        });
    try {
        const checkToken = jwt.verify(token, "password"); // kiểm tra token
        req.user = checkToken; //lưu token lại để có thể kiểm tra
        next();
    } catch (err) {
        res.status(400).send({
            status: 400,
            success: false,
            message: "Invalid token",
        }); // thông báo lỗi khi bạn nhập sai token.
    }
};