const express = require("express");
const router = express.Router();
const accountController = require("../app/controllers/AccountController");
const checkToken = require("../auth/checkToken");

router.post("/login", accountController.loginAccount);
router.get("/information", checkToken, accountController.getAccount);
router.post("/forgotpassword", accountController.forgotPassword);
router.post("/newpassword/:email", accountController.newPassword);
router.put("/changepassword", checkToken, accountController.changePassword);

module.exports = router;