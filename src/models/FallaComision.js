const mongoose = require('mongoose');

const fallaComisionSchema = new mongoose.Schema({
    censo: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    fundacion: { type: Number, required: false },
    seccion: { type: String, required: false },
    distintivo: { type: String, required: false }
});

module.exports = mongoose.model('FallaComision', fallaComisionSchema);
