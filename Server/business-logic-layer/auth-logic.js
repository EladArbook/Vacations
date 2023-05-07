const dal = require("../data-access-layer/dal");
const jwt = require("jsonwebtoken");
const config = require("../configuration");

//bring user's data once logged-in
async function loginAsync(credentials) {
    const sqlCmd = "SELECT `userId`, `firstName`, `lastName`, `userName`, `role`, `vacationFollowed` FROM `users` WHERE `userName` = '" + credentials.username + "' and `password` = '" + credentials.password + "'";
    const user = await dal.executeQueryAsync(sqlCmd);

    if (!user || user.length < 1)
        return null;

    delete user[0].password;
    user[0].token = jwt.sign({ user: user[0] }, config.jwtString, { expiresIn: "60 minutes" }); //token valid for:
    return user[0];
}

//register
function addUser(newUser) {
    if (newUser) {
        let errors = findErrors(newUser);
        if (errors)
            return false;
        const sqlCmd = "INSERT INTO `users`(`firstName`, `lastName`, `userName`, `password`, `role`, `vacationFollowed`) VALUES ('" + newUser.firstName + "','" + newUser.lastName + "','" + newUser.username + "','" + newUser.password + "', 'user' , '[]')"
        return dal.executeQueryAsync(sqlCmd);
    }
    else
        return false;
}

//register - check if username is already exist
async function getUserByUsername(username) {
    const sqlCmd = "SELECT `userName` FROM `users` WHERE `userName`='" + username + "'";
    let userExist = await dal.executeQueryAsync(sqlCmd);
    return userExist;
    //userName
}

//not exported function to check new user details for registration
function findErrors(newUser) {
    const errors = {};
    if (!newUser.firstName)
        errors.firstName = "User's first name is missing";
    else if (newUser.firstName.length < 2)
        errors.firstName = "User's first name is too short (min 2 characters)";
    else if (newUser.firstName.length > 20)
        errors.firstName = "User's first name is too long (max 20 characters)";

    if (!newUser.lastName)
        errors.lastName = "User's last name is missing";
    else if (newUser.lastName.length < 2)
        errors.lastName = "User's last name is too short (min 2 characters)";
    else if (newUser.lastName.length > 20)
        errors.lastName = "User's last name is too long (max 20 characters)";

    if (!newUser.username)
        errors.username = "Username is missing";
    else if (newUser.username.length < 4)
        errors.username = "Username is too short (min 4 characters)";
    else if (newUser.username.length > 10)
        errors.username = "Username is too long (max 10 characters)";

    if (!newUser.password)
        errors.password = "Password is missing";
    else if (newUser.password.length < 6)
        errors.password = "Password is too short (min 6 characters)";
    else if (newUser.password.length > 12)
        errors.password = "Password is too long (max 12 characters)";

    const errorsLength = Object.keys(errors).length;
    if (errorsLength <= 0)
        return null;
    else
        return errors;
}

module.exports = {
    loginAsync, getUserByUsername, addUser,
}