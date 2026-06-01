const express = require('express');
const router = express.Router();
const Lista = require('../models/Lista');

// Buscar todas as listas
router.get('/', async (req, res) => {
  try {
    const listas = await Lista.find();
    res.json(listas);
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao buscar listas' });
  }
});

// Criar nova lista
router.post('/', async (req, res) => {
  try {
    const novaLista = new Lista(req.body);
    const salva = await novaLista.save();
    res.status(201).json(salva);
  } catch (erro) {
    res.status(400).json({ error: 'Erro ao criar a lista' });
  }
});

module.exports = router;