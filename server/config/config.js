
//=====================================
//           Puerto
//=====================================
process.env.PORT = process.env.PORT || 3000;


//=====================================
//           Entorno
//=====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



//=====================================
//           Vencimiento token
//=====================================
process.env.CADUCIDAD_TOKEN = '48h';



//=====================================
//           SEED de autenticacion
//=====================================
module.exports.SEED = 'este-es-un-seed-de-prueba';

// process.env.SEED = process.env.SEED || 'este-es-el-seed-de-prueba';




//=====================================
//           Base de datos
//=====================================
let urlDB;

urlDB ='mongodb://localhost:27017/portafolioDB'

process.env.URLDB = urlDB;









// module.exports.CLIENT_ID = '582561889772-7igcfl6hk3blfb6a72hfi83giv0rl4fb.apps.googleusercontent.com';