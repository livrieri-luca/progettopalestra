const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registrazione di un nuovo utente
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Controlla se l'utente esiste già
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Email già registrata!' });
  }

  // Crea un nuovo utente
  const newUser = new User({ name, email, password });

  try {
    await newUser.save();
    res.status(201).json({ message: 'Utente registrato con successo!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore del server durante la registrazione!' });
  }
});

// Login di un utente
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Trova l'utente nel database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Utente non trovato!' });
  }

  // Confronta la password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Password errata!' });
  }

  // Genera un token JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ message: 'Login effettuato con successo!', token });
});

module.exports = router;
