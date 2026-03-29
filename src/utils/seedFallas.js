const mongoose = require('mongoose');
const FallaPremio = require('../models/FallaPremio');
require('dotenv').config();

const fallasData = [
    // 2026
    { premio: 1, censo: 12, comision: "Convento Jerusalén-Matemático Marzal", artista: "David Sánchez Llongo", lema: "¡Redimonis! Quin és el teu preu?", año: 2026, imagen: "https://www.cendradigital.com/wp-content/uploads/01-Falla-Convento-Jerusalen-2026-1.jpg" },
    { premio: 2, censo: 197, comision: "Monestir de Poblet-Aparicio Albiñana (L'Antiga de Campanar)", artista: "Josué Beitia Cardós", lema: "Sentiment", año: 2026, imagen: "https://www.cendradigital.com/wp-content/uploads/02-Falla-Antiga-Campanar-2026-1.jpg" },
    { premio: 3, censo: 9, comision: "Na Jordana", artista: "Mario Gual del Olmo", lema: "Passions a la deriva", año: 2026, imagen: "https://www.cendradigital.com/wp-content/uploads/3-Falla-Na-Jordana-2026-1.jpg" },
    { premio: 4, censo: 34, comision: "Plaça del Pilar", artista: "Paco Torres Josa", lema: "La Nit", año: 2026, imagen: "https://www.cendradigital.com/wp-content/uploads/4-Falla-Plaza-Pilar-2026-1.jpg" },
    { premio: 5, censo: 177, comision: "Sueca-Literato Azorín", artista: "Pedro Santaeulalia Serrán", lema: "Onírica", año: 2026, imagen: "https://www.cendradigital.com/wp-content/uploads/5-Falla-Sueca-2026-1.jpg" },
    { premio: 6, censo: 187, comision: "Avinguda Regne de València-Duc de Calàbria", artista: "Sergio Musoles Ros", lema: "La falla del regne... Animal!", año: 2026, imagen: "https://www.cendradigital.com/wp-content/uploads/6-Falla-Regne-2026-1.jpg" },
    { premio: 7, censo: 22, comision: "Exposició-Misser Mascó", artista: "Salva Banyuls i Néstor Ruiz", lema: "Meditem", año: 2026, imagen: "https://www.cendradigital.com/wp-content/uploads/7-Falla-Exposicion-2026-1.jpg" },
    { premio: 8, censo: 14, comision: "Almirante Cardaso-Conde Altea", artista: "Paco Giner", lema: "Res en excés", año: 2026, imagen: "https://www.cendradigital.com/wp-content/uploads/8-Falla-Almirante-Cadarso-2026-1.jpg" },
    { premio: 9, censo: 28, comision: "Cuba-Literato Azorín", artista: "Carlos Carsí García", lema: "Passant a millor vida", año: 2026, imagen: "https://www.cendradigital.com/wp-content/uploads/9-Falla-Cuba-Literato-Azorin-2026-1.jpg" },

    // 2025
    { premio: 1, censo: 12, comision: "Convento Jerusalén-Matemático Marzal", artista: "David Sánchez Llongo", lema: "Or", año: 2025, imagen: "https://www.cendradigital.com/wp-content/uploads/012-Falla-Convento-Jerusalen-2025-768x1024.jpg" },
    { premio: 2, censo: 197, comision: "L'Antiga de Campanar", artista: "Josué Beitia Cardós", lema: "Pangea", año: 2025, imagen: "https://www.cendradigital.com/wp-content/uploads/197-Falla-Antiga-Campanar-2025.jpg" },
    { premio: 3, censo: 9, comision: "Na Jordana", artista: "Mario Gual del Olmo", lema: "El tarot de les flames", año: 2025, imagen: "https://www.cendradigital.com/wp-content/uploads/009-Falla-Na-Jordana-2025.jpg" },

    // 2024
    { premio: 1, censo: 197, comision: "L'Antiga de Campanar", artista: "Josué Beitia", lema: "Canvi Climàtic", año: 2024, imagen: "https://www.cendradigital.com/wp-content/uploads/Falla-Antiga-Campanar-2024-01.jpg" },
    { premio: 2, censo: 22, comision: "Exposición-Micer Mascó", artista: "David Sánchez Llongo", lema: "Sensitiva", año: 2024, imagen: "https://www.cendradigital.com/wp-content/uploads/02-Falla-Exposici%C3%B3n-2024.jpg" },

    // 2023
    { premio: 1, censo: 22, comision: "Exposición-Micer Mascó", artista: "David Sánchez Llongo", lema: "Kromatika", año: 2023, imagen: "http://www.cendradigital.com/wp-content/uploads/01-Falla-Exposici%C3%B3n-2023.jpg" },
    { premio: 2, censo: 34, comision: "Plaza del Pilar", artista: "Paco Torres", lema: "We will survive", año: 2023, imagen: "http://www.cendradigital.com/wp-content/uploads/02-Falla-Plaza-del-Pilar-2023.jpg" },

    // 2022
    { premio: 1, censo: 12, comision: "Convento Jerusalén", artista: "Pere Baenas", lema: "2030", año: 2022, imagen: "http://www.cendradigital.com/wp-content/uploads/012-Falla-Convento-2022.jpg" },
    { premio: 2, censo: 34, comision: "Plaza del Pilar", artista: "Paco Torres", lema: "Escandal", año: 2022, imagen: "http://www.cendradigital.com/wp-content/uploads/034-Falla-Plaza-Pilar-2022.jpg" },

    // 2021
    { premio: 1, censo: 12, comision: "Convento Jerusalén", artista: "Pere Baenas", lema: "Desenmascarats", año: 2021, imagen: "http://www.cendradigital.com/wp-content/uploads/Falla-Convento-2021-1-1.jpg" },

    // 2019
    { premio: 1, censo: 197, comision: "L'Antiga de Campanar", artista: "Carlos Carsí", lema: "Juga, juga... i voràs", año: 2019, imagen: "http://www.cendradigital.com/wp-content/uploads/1-197.jpg" },

    // 2018
    { premio: 1, censo: 12, comision: "Convento Jerusalén", artista: "Pere Baenas", lema: "Per dalt o per baix", año: 2018, imagen: "http://www.cendradigital.com/wp-content/uploads/01c62287096654944dc2b35ffec6f6693162a62149_00001.jpg" },

    // 2017
    { premio: 1, censo: 197, comision: "L'Antiga de Campanar", artista: "Julio Monterrubio", lema: "Eterna seducció", año: 2017, imagen: "http://www.cendradigital.com/wp-content/uploads/01-197.jpg" },

    // 2016
    { premio: 1, censo: 28, comision: "Cuba-Literato Azorín", artista: "Carlos Carsí", lema: "Calla, canalla", año: 2016, imagen: "http://www.cendradigital.com/wp-content/uploads/Falla-Cuba-2016-2.jpg" },

    // 2015
    { premio: 1, censo: 34, comision: "Plaza del Pilar", artista: "Pere Baenas", lema: "Pantomima", año: 2015, imagen: "http://www.cendradigital.com/wp-content/uploads/03419.jpg" },

    // 2014
    { premio: 1, censo: 34, comision: "Plaza del Pilar", artista: "Pere Baenas", lema: "Escándalo", año: 2014, imagen: "http://www.cendradigital.com/wp-content/uploads/03416.jpg" }
];


async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a MongoDB para seed...");
        
        await FallaPremio.deleteMany({});
        console.log("Datos antiguos eliminados.");
        
        await FallaPremio.insertMany(fallasData);
        console.log("¡Base de datos de Fallas poblada con éxito!");
        
        process.exit();
    } catch (err) {
        console.error("Error en el seed:", err);
        process.exit(1);
    }
}

seed();
