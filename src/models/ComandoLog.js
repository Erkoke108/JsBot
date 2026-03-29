const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    comando: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ComandoLog', logSchema);