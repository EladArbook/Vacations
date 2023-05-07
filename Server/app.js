const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const updateLogic = require("./update-logic");


const authController = require("./controllers-layer/auth-controller");
const userController = require("./controllers-layer/user-controller");
const adminController = require("./controllers-layer/admin-controller");

app.use("/auth", authController);
app.use("/user", userController);
app.use("/admin", adminController);

app.use("*", (req, res) => {
    res.status(404).send(`Route not found ${req.originalUrl}`);
});


const listener = app.listen(3800, () => {
    console.log("🚀 Listening on 3800");
}).on("error", (err) => {
    if (err.code === "EADDRINUSE")
        console.log("Error: Port in use");
    else
        console.log("Error: Unknown error");
});

updateLogic.init(listener);