function verifyAdmin(req, res, next) {
    if (req.user && req.user.role == "admin")
        next();
    else {
        return res.status(401).send("Unauthorized (admin)");
    }
}

module.exports = verifyAdmin;
