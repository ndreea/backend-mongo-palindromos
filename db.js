
/*

En el db.js tenemos:
1. Importaciones
  1.1 dotenv
  1.2 moongose de MongoDB
2.Configuración de la conexión a MongoDB a través de Moongose y su exportación a index.js
3. Cierre de conexión cuando la terminal se apaga manualmente

*/


/*-----------------------------------*/


//Importamos Dotenv y Mongoose de MongoDB
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";


/*----------------------------------------------*/


//Configuración de la conexión a MongoDB
const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL); //Url de mongo
        //console.log("Conectado a MongoDB");

    } catch (error) {
        //console.error("Error al conectar con MongoDB", error);
        process.exit(1); //Detiene la app si falla la conexión
    }
};

//Exportar la función a index.js
export { conectarDB };


/*----------------------------------------------*/


//Cierre de conexión al apagar el servidor en la terminal
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    //console.log("Conexión a MongoDB cerrada");
    process.exit(0);
});