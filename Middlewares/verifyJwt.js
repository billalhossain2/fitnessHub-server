const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).send({ error: true, message: "Unauthorized Access" });
      return;
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
      if (error) {
        res.status(403).send({ error: true, message: "Forbidden Access" });
        return;
      }
      req.decoded = decoded;
      next();
    });
  };

  module.exports = verifyJwt