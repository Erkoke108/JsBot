const mongoose = require('mongoose');
const axios = require('axios');
const FallaComision = require('../models/FallaComision');
require('dotenv').config();

const URL_OPENDATA = 'https://geoportal.valencia.es/server/rest/services/OPENDATA/Turismo/MapServer/215/query?where=1=1&outFields=*&f=json';

async function diagnose() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // 1. Obtener todas las comisiones de nuestra DB (397)
        const dbComisiones = await FallaComision.find({}).sort({ censo: 1 });
        console.log(`📊 DB tiene ${dbComisiones.length} comisiones.`);

        // 2. Obtener datos de Opendata (344)
        const response = await axios.get(URL_OPENDATA);
        const opendata = response.data.features.map(f => f.attributes);
        console.log(`📡 Opendata tiene ${opendata.length} entradas.`);

        const opendataMap = new Map();
        opendata.forEach(item => {
            if (item.id_falla) opendataMap.set(item.id_falla, item.anyo_fundacion);
        });

        // 3. Cruzar datos y ver faltantes
        let actualizadas = 0;
        let sinFundacion = [];

        for (const c of dbComisiones) {
            const fundacion = opendataMap.get(c.censo);
            if (fundacion && fundacion > 0) {
                c.fundacion = fundacion;
                await c.save();
                actualizadas++;
            } else {
                sinFundacion.push({ censo: c.censo, nombre: c.nombre });
            }
        }

        console.log(`✅ Años de fundación actualizados: ${actualizadas}`);
        console.log(`⚠️ Comisiones sin año de fundación: ${sinFundacion.length}`);
        
        // Mostrar algunas que faltan para investigar
        console.log('--- Ejemplos de faltantes ---');
        console.log(sinFundacion.slice(0, 10));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

diagnose();
