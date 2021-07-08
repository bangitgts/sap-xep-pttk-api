//import
const express = require("express");
const app = express();
const port = 5000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const route = require("./routes/index.js");
//
app.use(cors());
app.use(cookieParser());
app.use(morgan("combined"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

route(app);

//start
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});