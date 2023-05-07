const express = require("express");
const verifyLoggedIn = require("../middleware/verify-logged-In");
const verifyAdmin = require("../middleware/verify-admin");
const adminLogic = require("../business-logic-layer/admin-logic");
const router = express.Router();
const fileUpload = require("express-fileupload");
router.use(fileUpload());

//jwt still valid ?  is it admin ?
router.get("/", [verifyLoggedIn, verifyAdmin], async (req, res) => { 
    try {
        res.status(200).send("Admin is logged in");
    }
    catch (err) {
        res.status(400).send("Couldn't connect to server. Please try again.");
        console.log(err.message);
    }
});

//get vacation with followers count
router.get("/reports", [verifyLoggedIn, verifyAdmin], async (req, res) => {
    try {
        const vacationFollowers = await adminLogic.getReports();
        res.status(200).send(vacationFollowers);
    }
    catch (err) {
        res.status(400).send("Couldn't connect to server. Please try again.");
        console.log(err.message);
    }
});

 //add new vacation
router.post("/", [verifyLoggedIn, verifyAdmin], async (req, res) => {
    try {
        const newVacation = JSON.parse(req.body.vacation);
        const image = req.files.image;
        await adminLogic.newVacation(newVacation, image);
        res.status(201).send("Vacation published.");
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send("error");
    }
});

//patch a vacation
router.patch("/change", [verifyLoggedIn, verifyAdmin], async (req, res) => {//patch vacation
    try {
        const vacationToPatch = JSON.parse(req.body.vacation);
        let image = "";
        if (req.body.image && req.body.image === "sameImg") //check if there's image file in the req
            image = "noImg"; //do not change image
        else
            image = req.files.image; //change image
        await adminLogic.patchVacation(vacationToPatch, image);
        res.status(200).send("Followed vacations were updated.");
    }
    catch (err) {
        res.status(400).send("Error");
        console.log(err.message);
    }
});

//delete vacation and it's image
router.delete("/delete/:id/:image", [verifyLoggedIn, verifyAdmin], async (req, res) => {
    try {
        const vacationId = req.params.id;
        const deleteImg = req.params.image;
        await adminLogic.deleteVacation(vacationId, deleteImg);
        res.status(200).send("Vacation has been deleted.");
    }
    catch (err) {
        res.status(400).send("Couldn't delete vacation.")
        console.log(err.message);
    }
});

module.exports = router;