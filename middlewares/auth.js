const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, process.env.jwt_token);

      req.user = decodedToken;
      next();
    } catch (verificationError) {
      return res.status(401).json({ message: "Invalid authorization token" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = { protect };
