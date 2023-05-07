const express = require("express");
const verifyLoggedIn = require("../middleware/verify-logged-In");
const userLogic = require("../business-logic-layer/user-logic");
const router = express.Router();
const path = require("path");

//check if user is logged-in
router.get("/", verifyLoggedIn, async (req, res) => {
    try {
        res.status(200).send("User is logged in");
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send(err);
    }
});

//get all vacations
router.get("/vacations", verifyLoggedIn, async (req, res) => {
    try {
        const vacationList = await userLogic.getVacationAsync();
        res.status(200).send(vacationList);
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send("Session time out.");
    }
});

//bring user's vacation following list
router.get("/followedVacations/:userId", verifyLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;
        const vacationsIdArray = await userLogic.getFollowedVacations(userId);
        res.status(200).send(vacationsIdArray);
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send("Cannot get following list.");
    }
});

//change user's vacation following list
router.patch("/follow", verifyLoggedIn, async (req, res) => {
    if (!req.body)
        return res.status(204).send("Request body is empty");
    try {
        const reqBody = req.body;
        await userLogic.followVacation(reqBody.userId, reqBody.vacationsToFollow);
        res.status(200).send("Followed vacations were updated.");
    }
    catch (err) {
        await res.status(400).send("Couldn't follow the vacation.");
        console.log(err.message);
    }
});

//change vacation's followers count
router.patch("/followers", verifyLoggedIn, async (req, res) => {
    try {
        const userFollow = req.body; // { vacationId: vacationId, followers: followers }
        await userLogic.changeFollowersCount(userFollow.vacationId, userFollow.followers);
        res.status(200).send("Patch OK");
    }
    catch (err) {
        res.status(400).send("Couldn't change followers count.");
        console.log(err.message);
    }
});

//export src of an image for vacation img's src
router.get("/images/:imageName", async (req, res) => {
    try {
        let a = 500;
        const imageName = req.params.imageName;
        let imagePath = path.join(__dirname, "..", "images", imageName);
        res.status(200).sendFile(imagePath);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Image wasn't found.");
    }
});

module.exports = router;