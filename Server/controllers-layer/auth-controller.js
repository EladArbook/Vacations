const express = require("express");
const authLogic = require("../business-logic-layer/auth-logic");
const Credentials = require("../model/credentials");
const router = express.Router();

router.post("/login", async (req, res) => {
   try {
        const credentials = new Credentials(req.body); //username + password

        const errors = credentials.validate(); //check if info is correctly inserted
        if (errors) {
            return res.status(400).send("Valid username and password are required");
        }
        const loggedInUser = await authLogic.loginAsync(credentials); //generate jwt for user
        if (!loggedInUser) {
            return res.status(401).send("Incorrect username or password")
        }
        //success
        res.json(loggedInUser);

    }
    catch (error) {
        console.log(error.message);
        res.status(400).send("Inncorrect username password combination");
    }
});

router.post("/register", async (req, res) => {
    try {
        const newUser = req.body;
        if (newUser) {
            const isExist = await authLogic.getUserByUsername(newUser.username);
            if (isExist.length >= 1)    //same username is alreay exists?
                return res.status(201).send(false);
            else if (authLogic.addUser(newUser)) {  //register
                return res.status(201).send(true);
            }
        }
        else
            throw ("Post failed");
    }
    catch (error) {
        res.status(400).send("Couldn't send user's info.");
        console.log(error.message);
    }
});

module.exports = router;