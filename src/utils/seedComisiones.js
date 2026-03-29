const mongoose = require('mongoose');
const axios = require('axios');
const FallaComision = require('../models/FallaComision');
require('dotenv').config();

const URL_API = 'https://geoportal.valencia.es/server/rest/services/OPENDATA/Turismo/MapServer/215/query?where=1=1&outFields=*&f=json';

async function seed() {
    try {
        console.log('--- Iniciando Censo Completo Fallas JCF ---');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB.');

        // 1. Obtener datos de la API de Open Data Valencia
        console.log('📡 Fetching data from Geoportal Valencia...');
        const response = await axios.get(URL_API);
        
        if (!response.data || !response.data.features) {
            throw new Error('No se pudieron obtener datos de la API.');
        }

        const rawFeatures = response.data.features;
        console.log(`📊 Recibidas ${rawFeatures.length} entradas de la API.`);

        // 2. Limpiar y mapear datos
        const comisiones = rawFeatures
            .map(f => f.attributes)
            .filter(attr => attr.id_falla !== null && attr.nombre !== null) // Filtramos los que no tienen censo o nombre
            .map(attr => ({
                censo: attr.id_falla,
                nombre: attr.nombre.trim(),
                fundacion: attr.anyo_fundacion || 0,
                seccion: attr.seccion || 'N/A',
                distintivo: attr.distintivo || '-'
            }));

        // 3. Eliminar duplicados por número de censo
        const uniqueComisiones = [];
        const seenCensos = new Set();
        
        for (const c of comisiones) {
            if (!seenCensos.has(c.censo)) {
                seenCensos.add(c.censo);
                uniqueComisiones.push(c);
            }
        }

        console.log(`🧹 Datos limpios. Preparadas ${uniqueComisiones.length} comisiones únicas.`);

        // 4. Guardar en Base de Datos
        await FallaComision.deleteMany({}); // Vaciar colección antigua si existe
        console.log('🗑️  Colección anterior eliminada.');

        await FallaComision.insertMany(uniqueComisiones);
        console.log(`🚀 ¡Éxito! Se han registrado ${uniqueComisiones.length} comisiones en el censo.`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante el seed:', error);
        process.exit(1);
    }
}

seed();
