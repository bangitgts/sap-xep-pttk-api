const AccountAdminModel = require("../../models/AccountAdmin");
const jwt = require("jsonwebtoken");
const mailer = require("../../utils/mailer");

function makeid(length) {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
class AccountController {
    //[POST] Login Account
    loginAccount(req, res) {
            let email = req.body.email;
            let password = req.body.password;
            AccountAdminModel.findOne({
                    email: email,
                    password: password,
                })
                .then((data) => {
                    if (data) {
                        let token = jwt.sign({
                                _id: data._id,
                            },
                            "password"
                        );
                        res.header("auth-token", token);
                        res.status(200).json({
                            message: "Loggin successfully",
                            data: {
                                email: email,
                                password: password,
                                token: token,
                            },
                            success: true,
                            status: 200,
                        });
                    } else {
                        return res.status(403).json({
                            message: "Loggin failed. Account or password does not match",
                            success: false,
                            status: 403,
                        });
                    }
                })
                .catch((err) => res.status(500).json(err));
        }
        //[GET] Account Information
    getAccount(req, res, next) {
            AccountAdminModel.findOne({
                    _id: req.user,
                })
                .then((data) => {
                    res.status(200).json({
                        status: 200,
                        success: true,
                        data: {
                            email: data.email,
                        },
                        message: "????ng nh???p th??nh c??ng",
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        status: 500,
                        success: false,
                        message: err,
                    });
                });
        }
        // [POST] Forgot Password
    forgotPassword(req, res, next) {
            const email = req.body.email;
            AccountAdminModel.findOne({ email: email })
                .then((data) => {
                    const c = makeid(6);
                    data.resetToken = c;
                    const sub = "Reset Password - Ph??n t??ch thi???t k??? d??? li???u v?? gi???i thu???t";
                    const htmlContent = `<h3>M?? x??c nh???n c???a qu?? kh??ch l?? ${c} </h3>`;
                    mailer.sendMail(req.body.email, sub, htmlContent);
                    data.save();
                    res.status(200).json({
                        message: "Your email has been sent successfully",
                        success: true,
                        status: 200,
                    });
                })
                .catch((err) => {
                    res.status(402).json({
                        message: err,
                        success: false,
                        status: 402,
                    });
                });
        }
        // [POST] New Password
    newPassword(req, res) {
            const email = req.params.email;
            const newPassword = req.body.newPassword;
            const token = req.body.token;
            AccountAdminModel.findOne({ email: email, resetToken: token })
                .then((data) => {
                    if (data === null) {
                        res.status(402).json({
                            message: "Token kh??ng h???p l???",
                            success: false,
                            status: 402,
                        });
                    } else {
                        data.password = newPassword;
                        data.resetToken = null;
                        data.save();
                        res.status(200).json({
                            message: "Change password successfully",
                            success: true,
                            status: 200,
                        });
                    }
                })
                .catch((err) => {
                    res.status(402).json({
                        message: "Token kh??ng h???p l???",
                        success: false,
                        status: 402,
                    });
                });
        }
        // [PUT] Change Password
    changePassword(req, res, next) {
        let password = req.body.password;
        let newPassword = req.body.newPassword;
        AccountAdminModel.findOne({
                _id: req.user,
                password: password,
            })
            .then((data) => {
                if (data) {
                    data.password = newPassword;
                    data.save();
                    res.status(200).json({
                        status: 200,
                        success: true,
                        message: "Change password successfully",
                    });
                } else {
                    res.status(402).json({
                        status: 402,
                        success: false,
                        message: "Old password entered is incorrect",
                    });
                }
            })
            .catch((err) => {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: "????ng nh???p kh??ng th??nh c??ng",
                });
            });
    }
}
module.exports = new AccountController();