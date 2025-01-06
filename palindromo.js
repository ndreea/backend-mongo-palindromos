
/*

En el palindromos.js tenemos:
1. Importaciones
  1.1 dotenv
  1.2 moongose de MongoDB
2.Definimos el modelo de cada palíndromo y lo exportamos a index.js (tipo string / tipo booleano)

*/


/*-------------------------------*/


//Importamos Dotenv y Mongoose de MongoDB
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";


/*----------------------------------------------*/


//Definir el esquema y el modelo de cada palíndromo
const palindromoSchema = new mongoose.Schema({
    texto: { type: String, required: true },
    palindromo: { type: Boolean, required: true }  
});

//Exportar el modelo a index.js
const Palindromo = mongoose.model("Palindromo", palindromoSchema);
export { Palindromo };