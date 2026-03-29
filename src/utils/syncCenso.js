const mongoose = require('mongoose');
const axios = require('axios');
const FallaComision = require('../models/FallaComision');
require('dotenv').config();

const URL_OPENDATA = 'https://geoportal.valencia.es/server/rest/services/OPENDATA/Turismo/MapServer/215/query?where=1=1&outFields=*&f=json';

// Datos recopilados manualmente y por el subagente para las que faltaban en el mapa
const MANUAL_FOUNDATIONS = {
    1: 1886,  // Mercado Central
    2: 1898,  // Mercado de Ruzafa
    3: 1891,  // Dr. Collado
    4: 1942,  // Portal de Valldigna
    7: 1890,  // Borrull - Turia
    9: 1884,  // Na Jordana
    11: 1872, // Plaza de la Merced
    12: 1893, // Convento Jerusalén
    13: 1887, // Pelliceros
    15: 1887, // Bolsería
    19: 1891, // Sant Bult
    21: 1954, // Sueca
    22: 1948, // Exposición
    28: 1927, // Cuba - Literato Azorín
    31: 1928, // Lo Rat Penat
    34: 1953, // Plaza del Pilar
    40: 1952, // Calabazas
    48: 1944, // Marqués de Montortal
    68: 1944, // Conserve
    392: 2018, // Les Arts
    396: 2023  // Turianova
};

async function sync() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔄 Iniciando sincronización de años de fundación...');

        // 1. Obtener datos de Opendata
        const response = await axios.get(URL_OPENDATA);
        const features = response.data.features;
        const opendataMap = new Map();

        features.forEach(f => {
            const attr = f.attributes;
            if (attr.id_falla && attr.anyo_fundacion > 0) {
                opendataMap.set(attr.id_falla, attr.anyo_fundacion);
            }
        });

        // 2. Actualizar DB
        const comisiones = await FallaComision.find({});
        let count = 0;

        for (const c of comisiones) {
            let year = opendataMap.get(c.censo) || MANUAL_FOUNDATIONS[c.censo];
            
            if (year && year > 0) {
                if (c.fundacion !== year) {
                    c.fundacion = year;
                    await c.save();
                    count++;
                }
            }
        }

        console.log(`✅ Sincronización completada. Se han actualizado ${count} registros.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la sincronización:', error);
        process.exit(1);
    }
}

sync();
