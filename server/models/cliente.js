const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clienteSchema = new Schema({
    nombre: {type: String, required:[true,'El nombre es necesario']},
    email: {type: String, required:[true,'El correo es necesario']},
    asunto: {type: String, required:[true,'El asunto es necesario']},
    mensaje: {type: String, required:[true,'El mensaje es necesario']},
    fecha: { type: Date, default: Date.now }
   
});

module.exports = mongoose.model('Cliente',clienteSchema);