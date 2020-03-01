const express = require('express');
const bcrypt = require('bcryptjs');
const mdAutenticacion = require('../middlewares/autenticacion');;

// Inicializar variables
const app = express();

const Usuario = require('../models/usuario');



app.get("/", (req, res, next) => {

  Usuario.find({ },'nombre nick perfil email img telefono direccion desc').exec((err, usuarios) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al cargar usuario",
        errors: err
      });
    }

      res.status(200).json({
        ok: true,
        usuarios
      });
    

   
  });
});


//------------------------//
//     Crea usuarios      //
//------------------------//
app.post('/',(req,res)=> {

  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    nick: body.nombre,
    perfil: body.perfil,
    email: body.email,
    password: bcrypt.hashSync(body.password,10)
    // img: body.img,
    // telefono: body.telefono
    // direccion: body.direccion,
    // desc: body.desc
  });

  usuario.save((err,usuarioGuardado) =>{

    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear usuario",
        errors: err
      });
    }

      res.status(201).json({
        ok: true,
        usuario: usuarioGuardado,
        usuarioToken: req.usuario
      });
  });

});



//------------------------//
//    Actualizar  //
//------------------------//
app.put('/:id',mdAutenticacion.verificaToken ,(req,res) => {

  let id = req.params.id;
  let body = req.body;

  Usuario.findById(id, (err,usuario) =>{



    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      });
    }

    if(!usuario){
      return res.status(400).json({
        ok: false,
        mensaje: `Usuario con el ${id} no existe`,
        errors: {
          message: 'No existe un usuario con ese id'
        }
      });
    }

    usuario.nombre = body.nombre;
    usuario.nick = body.nick;
    usuario.perfil = body.perfil;
    usuario.email = body.email;
    usuario.telefono = body.telefono;
    usuario.direccion = body.direccion;
    usuario.desc = body.desc;

    usuario.save((err,usuarioGuardado)=>{

      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar usuario",
          errors: err
        });
      }
      //para no devolver password
      usuarioGuardado.password = ':)';


      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });

  });

});

module.exports = app;