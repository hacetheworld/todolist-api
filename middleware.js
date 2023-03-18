const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    // console.log(token)
    // console.log(req.body,"dfgf");
    if (!token) {
      return res.status(403).json("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, "xyz");
      req.user = decoded;
    } catch (err) {
      return res.status(401).json("Invalid Token");
    }
    return next();
  };

module.exports = verifyToken;