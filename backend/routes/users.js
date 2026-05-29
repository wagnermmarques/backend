const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const users = await User.find({}, "username email name bio createdAt");
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/me", verifyToken, async (req, res, next) => {
  res.json(req.user.toJSON());
});

router.put(
  "/me",
  verifyToken,
  [
    body("email").optional().isEmail().withMessage("E-mail inválido"),
    body("password").optional().isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const updates = {};
    const { name, username, email, password, currentPassword, bio } = req.body;

    if (name) updates.name = name;
    if (username) updates.username = username.toLowerCase();
    if (email) updates.email = email.toLowerCase();
    if (bio !== undefined) updates.bio = bio;

    if (password) {
      if (!currentPassword) {
        return res.status(422).json({ error: "Senha atual é obrigatória para alterar a senha" });
      }

      const passwordIsValid = await req.user.validatePassword(currentPassword);
      if (!passwordIsValid) {
        return res.status(401).json({ error: "Senha atual incorreta" });
      }

      updates.passwordHash = password;
    }

    try {
      const existingUser = await User.findOne({
        $or: [
          { username: updates.username },
          { email: updates.email },
        ],
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(409).json({ error: "Username ou e-mail já estão em uso" });
      }

      Object.assign(req.user, updates);
      await req.user.save();

      res.json({
        message: "Perfil atualizado com sucesso",
        user: req.user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
