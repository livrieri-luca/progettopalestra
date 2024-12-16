const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definizione dello schema dell'utente
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // username deve essere unico
  },
  email: {
    type: String,
    required: true,
    unique: true, // email deve essere unica
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash della password prima di salvarla nel database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Non fare nulla se la password non è modificata
  try {
    // Crea un hash della password con un "salt" di 10
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err); // Passa l'errore se qualcosa va storto
  }
});

// Metodo per confrontare la password (utile per il login)
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Creazione del modello User
module.exports = mongoose.model('User', userSchema);
