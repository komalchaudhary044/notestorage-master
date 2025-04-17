const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: data.userId }; // ✅ match your token payload
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
