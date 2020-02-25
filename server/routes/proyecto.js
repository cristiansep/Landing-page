const express = require('express');

const mdAutenticacion = require('../middlewares/autenticacion');;


const app = express();


const Proyecto = require('../models/proyecto');

//----------------------------//
// Trae todos los proyectos //
//--------------------------//
app.get("/", (req, res) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  Proyecto.find({})
    .skip(desde)
    .limit(6)
    .populate("usuario", "nombre email")
    .exec((err, proyectos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al cargar proyectos",
          errors: err
        });
      }

      Proyecto.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          proyectos,
          total: conteo
        });
      });

      
    });
});


// ==========================================
// Obtener Proyecto por ID
// ==========================================
app.get("/:id", (req, res) => {

  var id = req.params.id;

  Proyecto.findById(id)
    .populate("usuario", "nombre img email")
    .exec((err, proyecto) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar Proyecto",
          errors: err
        });
      }

      if (!proyecto) {
        return res.status(400).json({
          ok: false,
          mensaje: "El proyecto con el id " + id + "no existe",
          errors: { message: "No existe un proyecto con ese ID" }
        });
      }

      res.status(200).json({
        ok: true,
        proyecto: proyecto
      });

    });
});


//-------------------------//
//     Crea Proyectos     //
//------------------------//
app.post('/',mdAutenticacion.verificaToken ,(req,res)=> {

  let body = req.body;

  let proyecto = new Proyecto({
    nombre: body.nombre,
    date: body.date,
    usuario: req.usuario._id
  });


  proyecto.save((err,proyectoGuardado) =>{

    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear proyecto",
        errors: err
      });
    }

      res.status(201).json({
        ok: true,
        proyecto: proyectoGuardado,
      
      });
  });

});


//------------------------//
//  Actualiza proyectos  //
//------------------------//
app.put('/:id',mdAutenticacion.verificaToken ,(req,res) => {

  let id = req.params.id;
  let body = req.body;

  Proyecto.findById(id, (err,proyecto) =>{



    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar proyecto",
        errors: err
      });
    }

    if(!proyecto){
      return res.status(400).json({
        ok: false,
        mensaje: `Proyectos con el ${id} no existe`,
        errors: {
          message: 'No existe un proyecto con ese id'
        }
      });
    }

    proyecto.nombre = body.nombre;
    proyecto.date = body.date;
    proyecto.usuario = req.usuario._id;
   

    proyecto.save((err,proyectoGuardado)=>{

      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar proyecto",
          errors: err
        });
      }
    

      res.status(200).json({
        ok: true,
        proyecto: proyectoGuardado
      });
    });

  });

});


//-------------------------//
//    Elimina proyectos   //
//------------------------//
app.delete('/:id',mdAutenticacion.verificaToken ,(req,res) => {

  let id = req.params.id;
  let body = req.body;

  Proyecto.findByIdAndRemove(id,(err, proyectoBorrado) =>{

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar proyecto",
        errors: err
      });
    }

    if (!proyectoBorrado) {
      return res.status(500).json({
        ok: false,
        mensaje: "No existe un proyecto con ese id",
        errors: err
      });
    }

      res.status(200).json({
        ok: true,
        proyecto: proyectoBorrado
      });
  });
});

module.exports = app;