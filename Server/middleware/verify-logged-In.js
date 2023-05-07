const jwt = require("jsonwebtoken");
const config = require("../configuration");


function verifyLoggedIn(req, res, next) {
    //authorization header ?

    if (!req.headers.authorization) {
        return false;
        return res.status(401).send("You are not logged-in");
    }
    //get token
    const token = req.headers.authorization.split(" ")[1]; //remove "bearer"
    if (!token)
        return res.status(401).send("You are not logged-in");
    false;

    jwt.verify(token, config.jwtString, (err, decodedToken) => {
        if (err) {
            if (err.message === "jwt required")
                return res.status(403).send("Your login session has exired");
            return res.status(401).send("You are not logged-in");
        }
        else {
            req.user = decodedToken.user;
            next();
        }
    });
}

module.exports = verifyLoggedIn;

/*use axios from app
send token from localStorage as header
don't forget "bearer"


*/