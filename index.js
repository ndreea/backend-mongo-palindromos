
/*

En el index.js tenemos:
1. Importaciones
  1.1 Mongoose (db.js), modelo de Palíndromos (palindromo.js)
  1.2 Dotenv, express u CORS

2. Iniciar servidores (express, cors para las rutas y el midelware para leer el JSON)
3. Carpeta pruebas
4. Función para verificar si una palabra es un palíndromo o no
5. Rutas
  5.1 Ruta para verificar y guardar palíndromos y su posterior guardado en la base de datos
  5.2 Ruta para obtener el historial de palíndromos (id, texto, true/false) generados
  5.3 //Ruta en caso de no encontrar la página (error 404)
6. Inicio en el puerto 3000

*/


/*----------------------------------------*/


//Importar conexión de MongoDB y modelo de palíndromos
import { conectarDB } from "./db.js";
import { Palindromo } from "./palindromo.js";

conectarDB(); //Iniciar la conexión con la base de datos

//Importar Dotenv, express y CORS
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const servidor = express(); //Iniciar la app de Express

servidor.use(cors()); //Habilitar CORS para todas las rutas
servidor.use(express.json()); //Middleware para leer JSON

//Asociamos el index.html para que aparezca una vez se carga la página
if (process.env.PRUEBAS) {
  servidor.use(express.static("./_pruebas"));
}


/*----------------------------------------------*/


//Función para verificar si la palabra es un palíndromo
function esPalindromo(texto) {
  const cleanedInput = texto.toLowerCase().replace(/[^a-z0-9]/g, ""); // Limpiar el texto
  return cleanedInput === texto.split("").reverse().join(""); //El texto se lee igual al derecho que al revés
};


/*----------------------------------------------*/


//Ruta para verificar y guardar palíndromos
servidor.post("/verificar", async (peticion, respuesta) => {
  const { texto } = peticion.body;

  //Si el usuario no escribe ningún texto le aparecerá una alerta
  if(!texto) {
    return respuesta
    .status(400) //Error en la petición del cliente
    .json({ error: "Debe escribir un texto" }); 
  }

  const resultado = esPalindromo(texto);

  //Guardamos el resultado en la base de datos
  try {
    const nuevoPalindromo = new Palindromo({ texto, palindromo: resultado });

    await nuevoPalindromo.save();

    respuesta.status(200); //Resultado exitoso
    respuesta.json({ texto, esPalindromo: resultado, mensaje: "Resultado guardado en la base de datos" });

  } catch(error) {
    respuesta.status(500); //Error en el servidor
    respuesta.json({ error: "Error al guardar en la base de datos" });
  }

});


//Ruta para obtener el historial de palíndromos (id, texto, true/false)
servidor.get("/historial", async (peticion, respuesta) => {
  
  try {
    //Excluir los campos "fecha" y "control de versiones"
    const historial = await Palindromo.find({}, { __v: 0, fecha: 0 });
    
    //Mapear de _id a id
    const historialFormateado = historial.map((registro) => ({
      id : registro._id,
      texto : registro.texto,
      esPalindromo : registro.esPalindromo,
    }));

    respuesta.json(historialFormateado)

  } catch(error) {
    respuesta.status(500); //Error en el servidor
    respuesta.json({ error: "Error al obtener el historial" });
  }

});


//Ruta en caso de no encontrar la página
servidor.use((peticion, respuesta) => {
  respuesta.status(404); //Error por defecto
  respuesta.json({ error : "Página no encontrada" });
});


/*----------------------------------------------*/


//Iniciar el servidor en el Puerto 3000
servidor.listen(process.env.PORT); 