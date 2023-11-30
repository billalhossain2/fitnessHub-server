const verifyAdmin = (req, res, next) => {
    const email = req.decoded?.email;
    console.log("Decoded email==========> ", email);
    next();
  };

  module.exports = verifyAdmin;