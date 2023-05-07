const dal = require("../data-access-layer/dal");

//get all vacations
async function getVacationAsync() {
    const sqlCmd = "SELECT * FROM `vacations` WHERE 1";
    return dal.executeQueryAsync(sqlCmd);
}

//patch user's JSON array - add/remove vacation id when follow/unfollow
async function followVacation(userId, vacationList) {
    const sqlCmd = "UPDATE `users` SET `vacationFollowed`='" + vacationList + "' WHERE `userId` = " + userId;
    return dal.executeQueryAsync(sqlCmd);
}

//get JSON array with user's vacation follow list
async function getFollowedVacations(userId) {
    const sqlCmd = "SELECT `vacationFollowed` FROM `users` WHERE `userId`= " + userId;
    return dal.executeQueryAsync(sqlCmd);
}

//patch number of followers to a vacation - add/decrease
async function changeFollowersCount(vacationId, followers) {
    const sqlCmd = "UPDATE `vacations` SET `followers`='" + followers + "' WHERE `vacationId` =" + vacationId;
    return dal.executeQueryAsync(sqlCmd);
}

module.exports = { getVacationAsync, getFollowedVacations, followVacation, changeFollowersCount }