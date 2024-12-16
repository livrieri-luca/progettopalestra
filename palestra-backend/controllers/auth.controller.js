// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Registrazione utente
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  // Verifica se l'utente esiste già
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ msg: 'Utente già esistente' });

  // Crea un nuovo utente
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });

  try {
    await user.save();
    res.status(201).json({ msg: 'Utente registrato con successo!' });
  } catch (err) {
    res.status(500).json({ msg: 'Errore del server' });
  }
};

// Login utente
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Trova l'utente
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Credenziali errate' });

  // Verifica la password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ msg: 'Credenziali errate' });

  // Crea un token JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};
