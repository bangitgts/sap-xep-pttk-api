//import
const express = require("express");
const app = express();
const port = 5000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const route = require("./routes/index.js");
var secure = require("express-force-https");
const https = require("https");
const path = require("path");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session = require("express-session");
//
app.use(secure);
app.use(cors());
app.use(cookieParser());
app.use(morgan("combined"));

// path
app.use("/", express.static(path.join(__dirname, "/template")));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//
const FACEBOOK_APP_ID = "";
const FACEBOOK_APP_SECRET = "";

passport.use(
    new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: "/facebook",
            profileFields: ["email"],
        },
        function(accessToken, refreshToken, profile, callback) {
            callback(null, profile);
        }
    )
);
passport.serializeUser((user, callback) => {
    callback(null, user);
});
passport.deserializeUser((user, callback) => {
    callback(null, user);
});
app.use(
    session({
        secret: "json",
        resave: true,
        saveUninitialized: true,
    })
);
route(app);
app.get(
    "/login/facebook",
    passport.authenticate("facebook", { scope: "email" })
);
app.get("/facebook/", passport.authenticate("facebook"), (req, res) => {
    res.redirect("/");
});
app.get("/", (req, res) => {
    res.send(req.user ? req.user : "Not login");
});
//start
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});