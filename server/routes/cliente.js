const express = require('express');

const mdAutenticacion = require('../middlewares/autenticacion');;


const app = express();


const Cliente = require('../models/cliente');

//----------------------------//
// Trae todos los clientes //
//--------------------------//
app.get("/", (req, res) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  Cliente.find({})
    .skip(desde)
    .limit(6)
    .exec((err, clientes) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al cargar clientes",
          errors: err
        });
      }

      Cliente.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          clientes,
          total: conteo
        });
      });

      
    });
});


// ==========================================
// Obtener Cliente por ID
// ==========================================
app.get("/:id", mdAutenticacion.verificaToken ,(req, res) => {

  var id = req.params.id;

  Cliente.findById(id)
    .exec((err, cliente) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar cliente",
          errors: err
        });
      }

      if (!cliente) {
        return res.status(400).json({
          ok: false,
          mensaje: "El cliente con el id " + id + "no existe",
          errors: { message: "No existe un cliente con ese ID" }
        });
      }

      res.status(200).json({
        ok: true,
        cliente: cliente
      });

    });
});


//-------------------------//
//     Crea clientes     //
//------------------------//
app.post('/',(req,res)=> {

  let body = req.body;

  let cliente = new Cliente({
    nombre: body.nombre,
    email: body.email,
    asunto: body.asunto,
    mensaje: body.mensaje
  });


  cliente.save((err,clienteGuardado) =>{

    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al enviar mensaje",
        errors: err
      });
    }

      res.status(201).json({
        ok: true,
        cliente: clienteGuardado,
      
      });
  });

});


//------------------------//
//  Actualiza clientes  //
//------------------------//
app.put('/:id',mdAutenticacion.verificaToken ,(req,res) => {

  let id = req.params.id;
  let body = req.body;

  Cliente.findById(id, (err,cliente) =>{



    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar cliente",
        errors: err
      });
    }

    if(!cliente){
      return res.status(400).json({
        ok: false,
        mensaje: `Clientes con el ${id} no existe`,
        errors: {
          message: 'No existe un cliente con ese id'
        }
      });
    }

    cliente.nombre = body.nombre;
    cliente.email = body.email;
    cliente.asunto = body.asunto;
    cliente.mensaje = body.mensaje;

    cliente.save((err,clienteGuardado)=>{

      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar cliente",
          errors: err
        });
      }
    

      res.status(200).json({
        ok: true,
        cliente: clienteGuardado
      });
    });

  });

});


//-------------------------//
//    Elimina clientes   //
//------------------------//
app.delete('/:id',mdAutenticacion.verificaToken ,(req,res) => {

  let id = req.params.id;
  let body = req.body;

  Cliente.findByIdAndRemove(id,(err, clienteBorrado) =>{

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar cliente",
        errors: err
      });
    }

    if (!clienteBorrado) {
      return res.status(500).json({
        ok: false,
        mensaje: "No existe un cliente con ese id",
        errors: err
      });
    }

      res.status(200).json({
        ok: true,
        cliente: clienteBorrado
      });
  });
});

module.exports = app;