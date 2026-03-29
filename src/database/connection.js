const mongoose = require('mongoose');
require('dotenv').config();

// Limpiamos la URI de posibles espacios o saltos de línea invisibles
const uri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : null;

if (!uri || !uri.startsWith('mongodb')) {
    console.error('❌ [Database] La MONGO_URI en el .env no es válida o está vacía.');
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => console.log('🍃 [Database] Conexión establecida con MongoDB Atlas.'))
    .catch((err) => {
        console.error('❌ [Database] Error crítico de conexión:');
        console.error(err.message);
    });

module.exports = mongoose.connection;