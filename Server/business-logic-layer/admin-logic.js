const dal = require("../data-access-layer/dal");
const path = require("path");
const fs = require("fs");

// post new vacation
async function newVacation(vacation, image) { 
    const generateName = String(Math.floor(Math.random() * 10000000)) + "_" + image.name;;
    const absolutePath = path.join(__dirname, "..", "images", generateName);
    await image.mv(absolutePath);
    const sqlCmd = "INSERT INTO `vacations`(`description`, `destination`, `imageSrc`, `start`, `end`, `price`, `followers`) VALUES ('" + vacation.description + "','" + vacation.destination + "','" + generateName + "','" + vacation.start + "','" + vacation.end + "','" + vacation.price + "','0')";
    return dal.executeQueryAsync(sqlCmd);
}

//patch vacation's data
async function patchVacation(updateVac, image) {
    if (image === "noImg") {//patch vacation but keep current image
        const sqlCmd = "UPDATE `vacations` SET `description`='" + updateVac.description + "',`destination`='" + updateVac.destination + "',`start`='" + updateVac.start + "',`end`='" + updateVac.end + "',`price`='" + updateVac.price + "' WHERE `vacationId` = " + updateVac.vacationId;
        return dal.executeQueryAsync(sqlCmd);
    }
    else {//patch vacation, delete previous image and add a new one
        const lastImage = path.join(__dirname, "..", "images", updateVac.prevImage);
        if (await !deleteImage(lastImage)) {
            console.log(`Image wasn't delete at '${lastImage}'`);
        }
        const generateName = String(Math.floor(Math.random() * 10000000)) + "_" + image.name;
        const absolutePath = path.join(__dirname, "..", "images", generateName);
        await image.mv(absolutePath);
        const sqlCmd = "UPDATE `vacations` SET `description`='" + updateVac.description + "',`destination`='" + updateVac.destination + "',`imageSrc`='" + generateName + "',`start`='" + updateVac.start + "',`end`='" + updateVac.end + "',`price`='" + updateVac.price + "' WHERE `vacationId` = " + updateVac.vacationId;
        return dal.executeQueryAsync(sqlCmd);
    }
}

// not-exported func for deleting image when patch or delete vacation
async function deleteImage(imagePath) { 
    try {
        fs.unlink(imagePath, (err) => {
            if (err)
                return false;
            else
                return true;
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}

//delete vacation and it's image
async function deleteVacation(vacationId, deleteImg) {
    const imagePath = path.join(__dirname, "..", "images", deleteImg);
    if (!deleteImage(imagePath)) {
        console.log(`Image wasn't delete at '${imagePath}'`);
    }
    const sqlCmd = "DELETE FROM `vacations` WHERE `vacationId` = " + vacationId;
    return dal.executeQueryAsync(sqlCmd);
}

 //get vacations with their followers count
async function getReports() {
    const sqlCmd = "SELECT `vacationId`,`destination`,`followers` FROM `vacations` WHERE `followers`>0";
    return dal.executeQueryAsync(sqlCmd);
}

module.exports = { patchVacation, deleteVacation, newVacation, getReports }