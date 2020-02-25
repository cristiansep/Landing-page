const mongoose = require('mongoose');

// date: { type: Date, default: Date.now },

const Schema = mongoose.Schema;

const proyectoSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre del proyecto es necesario']},
    img: {type: String, required: false},
    date: { type: Date, required:false },
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'}
});

module.exports = mongoose.model('Proyecto', proyectoSchema);