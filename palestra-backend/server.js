const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Carica variabili d'ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;  // Cambia la porta a 3000

// Middleware
app.use(cors());
app.use(express.json()); // Parsing del corpo della richiesta in formato JSON

// Connessione al database MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => {
    console.log("Connesso a MongoDB");
  })
  .catch(err => {
    console.error("Errore di connessione al database: ", err);
    process.exit(1); // Esci se la connessione fallisce
  });

// Rotte
app.get('/', (req, res) => {
  res.send('Benvenuto nella Palestra API!');
});

// Importazione delle rotte per l'autenticazione
const authRoute = require('./routes/auth.route');

// Usa la rotta di autenticazione
app.use('/api/auth', authRoute);

// Gestione degli errori generali (fino ad ora non trattati)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Errore interno del server' });
});

// Serve il client Angular se in modalità produzione
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

// Avvio del server
app.listen(port, () => {
  console.log(`Server avviato sulla porta ${port}`);
});
