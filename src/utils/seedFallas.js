const mongoose = require('mongoose');
const FallaPremio = require('../models/FallaPremio');
require('dotenv').config();

const fallasData = [
    // 2026
    { premio: 1, censo: 12, comision: "Convento Jerusalén-Matemático Marzal", artista: "David Sánchez Llongo", lema: "¡Redimonis! Quin és el teu preu?", año: 2026 },
    { premio: 2, censo: 197, comision: "Monestir de Poblet-Aparicio Albiñana (L'Antiga de Campanar)", artista: "Josué Beitia Cardós", lema: "Sentiment", año: 2026 },
    { premio: 3, censo: 9, comision: "Na Jordana", artista: "Mario Gual del Olmo", lema: "Passions a la deriva", año: 2026 },
    { premio: 4, censo: 34, comision: "Plaça del Pilar", artista: "Paco Torres Josa", lema: "La Nit", año: 2026 },
    { premio: 5, censo: 177, comision: "Sueca-Literato Azorín", artista: "Pedro Santaeulalia Serrán", lema: "Onírica", año: 2026 },
    { premio: 6, censo: 187, comision: "Avinguda Regne de València-Duc de Calàbria", artista: "Sergio Musoles Ros", lema: "La falla del regne... Animal!", año: 2026 },
    { premio: 7, censo: 22, comision: "Exposició-Misser Mascó", artista: "Salva Banyuls i Néstor Ruiz", lema: "Meditem", año: 2026 },
    { premio: 8, censo: 14, comision: "Almirante Cardaso-Conde Altea", artista: "Paco Giner", lema: "Res en excés", año: 2026 },
    { premio: 9, censo: 28, comision: "Cuba-Literato Azorín", artista: "Carlos Carsí García", lema: "Passant a millor vida", año: 2026 },

    // 2025
    { premio: 1, censo: 12, comision: "Convent de Jerusalem-Matemàtic Marzal", artista: "David Sánchez Llongo", lema: "Or", año: 2025 },
    { premio: 2, censo: 197, comision: "Monestir de Poblet-Aparicio Albiñana (L'Antiga de Campanar)", artista: "Josué Beitia Cardós", lema: "Pangea", año: 2025 },
    { premio: 3, censo: 9, comision: "Na Jordana", artista: "Mario Gual del Olmo", lema: "El tarot de les flames", año: 2025 },
    { premio: 4, censo: 34, comision: "Plaça del Pilar", artista: "Francisco Torres Josa", lema: "Icònica", año: 2025 },
    { premio: 5, censo: 22, comision: "Exposició-Misser Mascó", artista: "Salva Banyuls y Néstor Ruiz", lema: "Jaque mate a la rutina", año: 2025 },
    { premio: 6, censo: 187, comision: "Regne de València-Duc de Calàbria", artista: "Sergio Musoles Ros", lema: "Scénica", año: 2025 },
    { premio: 7, censo: 28, comision: "Cuba-Literat Azorín", artista: "Antonio Pérez Mena", lema: "Orgásmica", año: 2025 },
    { premio: 8, censo: 177, comision: "Sueca-Literat Azorín", artista: "Santaeulalia Fallas y Fogueres", lema: "Reset", año: 2025 },
    { premio: 9, censo: 14, comision: "Almirall Cadarso-Comte d'Altea", artista: "Francisco Giner Nuñez", lema: "Wanderlust", año: 2025 },

    // 2024
    { premio: 1, censo: 197, comision: "Monestir de Poblet-Aparicio Albiñana (L'Antiga de Campanar)", artista: "Josué Beitia", lema: "Canvi Climàtic", año: 2024 },
    { premio: 2, censo: 22, comision: "Exposició-Misser Mascó", artista: "David Sánchez Llongo", lema: "Sensitiva, descobrint els cinc sentits", año: 2024 },
    { premio: 3, censo: 34, comision: "Pilar, Pl.", artista: "Paco Torres", lema: "Vudú", año: 2024 },
    { premio: 4, censo: 177, comision: "Sueca-Literat Azorín", artista: "Pedro Santaeulalia", lema: "Dame un like", año: 2024 },
    { premio: 5, censo: 28, comision: "Cuba-Literat Azorín", artista: "Vicente Martínez", lema: "Quiéreme loca", año: 2024 },
    { premio: 6, censo: 12, comision: "Convent de Jerusalem-Matemàtic Marzal", artista: "Pere Baenas", lema: "Olimpia", año: 2024 },
    { premio: 7, censo: 187, comision: "Regne de València-Duc de Calàbria", artista: "Sergio Musoles", lema: "The Regnepolitan Museum", año: 2024 },
    { premio: 8, censo: 9, comision: "Na Jordana", artista: "Mario Gual", lema: "Memòries de l'avenir", año: 2024 },
    { premio: 9, censo: 14, comision: "Almirall Cadarso-Comte d'Altea", artista: "Toni Pérez", lema: "La raó de la desraó", año: 2024 },

    // 2023
    { premio: 1, censo: 22, comision: "Exposición-Micer Mascó", artista: "David Sánchez Llongo", lema: "Kromatika", año: 2023 },
    { premio: 2, censo: 34, comision: "Plaza del Pilar", artista: "Paco Torres", lema: "We will survive", año: 2023 },
    { premio: 3, censo: 12, comision: "Convento Jerusalén-Matemático Marzal", artista: "Pere Baenas", lema: "Por un puñado de euros", año: 2023 },
    { premio: 4, censo: 9, comision: "Na Jordana", artista: "Mario Gual del Olmo", lema: "Esperança, fe, amor i sort", año: 2023 },
    { premio: 5, censo: 177, comision: "Sueca-Literato Azorín", artista: "Santaeulalia Tematización", lema: "危 機 (Crisistunidad): “Asia” on anem?", año: 2023 },
    { premio: 6, censo: 28, comision: "Cuba-Literato Azorín", artista: "Vicente Martínez Aparisi", lema: "Vida", año: 2023 },
    { premio: 7, censo: 197, comision: "Monestir de Poblet-Aparicio Albiñana (L'Antiga)", artista: "Carlos Carsí García", lema: "Som de colors", año: 2023 },
    { premio: 8, censo: 14, comision: "Almirante Cadarso-Conde Altea", artista: "Antonio Pérez Mena", lema: "Que no pare la música", año: 2023 },
    { premio: 9, censo: 187, comision: "Reino de Valencia-Duque de Calabria", artista: "Sergio Musoles Ros", lema: "Llámalo amor, llámalo X", año: 2023 },

    // Primeros Premios Adicionales
    { premio: 1, censo: 12, comision: "Convento Jerusalén-Matemático Marzal", artista: "Pere Baenas", lema: "2030", año: 2022 },
    { premio: 1, censo: 12, comision: "Convento Jerusalén-Matemático Marzal", artista: "Pere Baenas", lema: "Desenmascarats", año: 2021 },
    { premio: 1, censo: 197, comision: "L'Antiga de Campanar", artista: "Carlos Carsí", lema: "Juga, juga... i voràs", año: 2019 },
    { premio: 1, censo: 12, comision: "Convento Jerusalén-Matemático Marzal", artista: "Pere Baenas", lema: "Per dalt o per baix", año: 2018 },
    { premio: 1, censo: 197, comision: "L'Antiga de Campanar", artista: "Julio Monterrubio", lema: "Eterna seducció", año: 2017 },
    { premio: 1, censo: 34, comision: "Plaza del Pilar", artista: "Paco Torres", lema: "Pantomima", año: 2016 },
    { premio: 1, censo: 34, comision: "Plaza del Pilar", artista: "Pere Baenas", lema: "Pantomima (bis)", año: 2015 },
    { premio: 1, censo: 34, comision: "Plaza del Pilar", artista: "Pere Baenas", lema: "Escándalo", año: 2014 }
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
