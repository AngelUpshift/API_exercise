const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const token = jwt.sign(
    { name: user.name, id: user.id },
    process.env.JWT_SECRET
  );

  return token;
};

const validateToken = (req, res, next) => {
  /// this function is middleware
  const accessToken = req.cookies["access-token-cookie"];

  if (!accessToken) {
    return res.status(400).json({ message: "User is not Authenticated!" });
  }

  try {
    const validToken = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createToken, validateToken };
