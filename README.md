# 🤖 Discord.js v14 - Bot Avanzado y Modular

Un bot de Discord potente, seguro y completamente modular construido con **Discord.js v14**. Diseñado para ser extensible y fácil de configurar.

## ✨ Características Principales

*   **Arquitectura Modular:** Sistema automatizado de carga de comandos y eventos para un desarrollo organizado.
*   **Base de Datos Integrada:** Conectividad robusta con **MongoDB Atlas** para persistencia de datos.
*   **Comandos de Barra (/):** Implementación total de Slash Commands con registro dinámico.
*   **Seguridad:** Estructura preparada para manejar errores y evitar cierres inesperados.
*   **Logs Detallados:** Seguimiento exhaustivo de comandos y eventos en la consola para una depuración eficiente.

## 📂 Estructura del Proyecto

```text
JSBot/
├── src/
│   ├── commands/       # Categorías de comandos (admin, fun, utilidad)
│   ├── components/     # Botones, modales y menús de selección
│   ├── database/       # Configuración de Mongoose
│   ├── events/         # Handlers de eventos de Discord
│   ├── functions/      # Motores de carga (handlers)
│   ├── models/         # Esquemas de base de datos
│   └── utils/          # Herramientas y utilidades
├── logs/               # Archivos de registro (opcional)
├── .env                # Variables de entorno (Token, APIs, DB)
└── package.json        # Dependencias y scripts
```

## 🛠️ Comandos Disponibles

| Categoría | Comando | Descripción | Permisos Requeridos |
| :--- | :--- | :--- | :--- |
| **Admin** | `/limpiar` | Elimina mensajes del canal de forma masiva | Gestionar Mensajes |
| **Admin** | `/badge` | Información sobre la insignia de desarrollador | @everyone |
| **Utilidad**| `/stats` | Estado del bot (RAM, Ping, Uptime) | @everyone |
| **Utilidad**| `/tiempo` | Consulta el clima en tiempo real | @everyone |
| **Fallas**  | `/fallas` | Consulta el histórico de premios de la Sección Especial | @everyone |
| **Fallas**  | `/comisiones` | Consulta el mapa y datos de comisiones desde Open Data Valencia | @everyone |

## ⚙️ Configuración del Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto y completa los siguientes campos:

```env
DISCORD_TOKEN=TU_TOKEN_AQUI
CLIENT_ID=ID_DE_TU_APLICACION
MONGO_URI=TU_CONEXION_MONGODB_ATLAS
WEATHER_API_KEY=TU_OPENWEATHERMAP_API_KEY
```

## 🚀 Instalación y Ejecución

1.  **Clonar el repositorio** (o descargar los archivos).
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Iniciar el bot:**
    *   **Producción:** `npm start`
    *   **Desarrollo (con auto-recarga):** `npm run dev`

---

## 📦 Dependencias Principales

*   `discord.js v14` - Motor del bot
*   `mongoose` - Conector de MongoDB
*   `axios` - Peticiones HTTP para la API de clima
*   `dotenv` - Gestión de variables de entorno
*   `nodemon` - Entorno de desarrollo con auto-recarga

---
Desarrollado con ❤️ por [Erkoke108](https://github.com/Erkoke108)
