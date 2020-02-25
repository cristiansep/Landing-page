require('./config/config');

const express = require('express');
const mongoose = require('mongoose'); mongoose.set('useCreateIndex', true); mongoose.set('useFindAndModify', false);
const path = require('path');
const bodyParser = require('body-parser');

const app = express();


// Cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS"); 
    next();
  });


// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));




// Importar rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');
const uploadRoutes = require('./routes/upload');
const proyectoRoutes = require('./routes/proyecto');
const clienteRoutes = require('./routes/cliente');
const imagenesRoutes = require('./routes/imagenes');



// Conexion a la base de datos con ODM mongoose
mongoose.connection.openUri(process.env.URLDB, 
        {useNewUrlParser: true , useCreateIndex: true , useUnifiedTopology: true }, (err,res) =>{

    if(err) throw err;

    console.log('Base de datos: \x1b[34m%s\x1b[0m','online');

});



//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/proyecto', proyectoRoutes);
app.use('/cliente', clienteRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);






app.listen(process.env.PORT,()=>{
    console.log('Escuchando puerto:',process.env.PORT, '\x1b[34m%s\x1b[0m','online');
});