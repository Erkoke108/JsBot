const mongoose = require('mongoose');
const fs = require('fs');
const FallaComision = require('../models/FallaComision');
require('dotenv').config();

async function seed() {
    try {
        console.log('--- Iniciando Sincronización de Censo (BDFallas) ---');
        await mongoose.connect(process.env.MONGO_URI);
        
        const html = fs.readFileSync('bdfallas_comisiones.html', 'utf8');
        
        // Regex para extraer Nº del censo y nombre
        // Ejemplo: <span class='numcomision'>Nº1</span> - <a href='...'>Mercado Central (...)</a>
        const regex = /<span class='numcomision'>Nº(\d+)<\/span>\s*-\s*<a[^>]*>([^<]+)<\/a>/g;
        let match;
        const comisionesMap = new Map();

        while ((match = regex.exec(html)) !== null) {
            const censo = parseInt(match[1]);
            let nombreFull = match[2].trim();
            
            // Limpiar el nombre (quitar el número de fallas en su DB al final entre paréntesis)
            // Ejemplo: "Mercado Central (la Número 1 / del Comercio) (86)" -> "Mercado Central (la Número 1 / del Comercio)"
            const nombre = nombreFull.replace(/\s*\(\d+\)$/, '');
            
            if (censo > 0 && censo < 1000) { // Evitamos los números de prueba como 999999
                comisionesMap.set(censo, { censo, nombre });
            }
        }

        console.log(`✅ Se han extraído ${comisionesMap.size} comisiones del archivo HTML.`);

        // Intentar mantener los años de fundación si ya existen en la DB o si los tenemos de otra fuente
        const comisionesFinales = Array.from(comisionesMap.values()).map(c => ({
            ...c,
            fundacion: 0 // Por defecto 0, si quisiéramos ser más precisos necesitaríamos otra pasada
        }));

        await FallaComision.deleteMany({ censo: { $lt: 1000 } });
        await FallaComision.insertMany(comisionesFinales);

        console.log(`🚀 Base de datos actualizada con el censo completo (${comisionesFinales.length} comisiones).`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seed();
