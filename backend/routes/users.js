const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { getToken, verifyToken, verifyAdmin } = require('../middleware/auth');

// Rota para listar todos os usuários (necessária para o Painel Administrativo)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = getToken({ id: user._id });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Deletar usuário (admin apenas)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

module.exports = router;