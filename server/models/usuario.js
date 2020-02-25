const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: {type: String, required:[true,'El nombre es necesario']},
    nick: {type: String, required:[true,'El nombre de usuario es necesario']},
    perfil: {type: String, required:[true,'El perfil es necesario']},
    email: {type: String, unique: true, required:[true,'El correo es necesario']},
    password: {type: String, required:[true,'La contraseña es necesario']},
    img: {type: String, required:false},
    telefono: {type: String, required:[true,'El telefono es necesario']},
    direccion: {type: String, required:false},
    desc: {type: String, required:false}
   
});

module.exports = mongoose.model('Usuario',usuarioSchema);