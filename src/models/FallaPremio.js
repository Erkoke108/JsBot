const mongoose = require('mongoose');

const fallaPremioSchema = new mongoose.Schema({
    premio: { type: Number, required: true },
    comision: { type: String, required: true },
    censo: { type: Number, required: true },
    artista: { type: String, required: true },
    lema: { type: String, required: true },
    año: { type: Number, required: true },
    seccion: { type: String, default: 'Especial' }
});

module.exports = mongoose.model('FallaPremio', fallaPremioSchema);
