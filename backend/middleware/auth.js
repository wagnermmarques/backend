const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "default-secret", {
    expiresIn: "8h",
  });
};

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticação ausente" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "default-secret");
    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(401).json({ error: "Usuário inválido" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

module.exports = { getToken, verifyToken };
