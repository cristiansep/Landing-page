const express = require('express');

const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

const Usuario = require('../models/usuario');
// const Medico = require('../models/medico');
const Proyecto = require('../models/proyecto');

// cloudinary
var cloudinary = require('cloudinary');
var cloudinary = require('cloudinary').v2;


app.use(fileUpload());

app.put('/:tipo/:id',(req,res,next) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    // Validaciom tipo de coleccion
    let tiposValidos = ['proyectos','usuarios'];

    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: "Error tipo coleccion no valida",
            errors:{message: 'Debe seleccionar una coleccion valida' }
          });
    }

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: "Error no selecciono ningun archivo",
            errors:{message: 'Debe seleccionar una imagen' }
          });
    }


    //Obtener nombre del archivo
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]


    // Validacion de extensiones
    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if(extensionesValidas.indexOf(extension) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: "Extension no valida",
            errors:{message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
          });
    }


    // Nombre de archivo personalizado
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    // Mover archivo temporal a un path
    let path = `./uploads/${tipo}/${nombreArchivo}`;
  

    archivo.mv(path, err =>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: "Error al mover archivo",
                errors:err
              });
              
        }
     

        subirPorTipo(tipo, id, nombreArchivo, res);
      
    });

   

  
});


// async function subirFotoNube(path) {
//     cloudinary.config({ 
//         cloud_name: 'cristiansep', 
//         api_key: '394173737757678', 
//         api_secret: 'CLOUDINARY_URL=cloudinary://394173737757678:vpjbLbNdOxAJzS-sPlCxa8SwsVY@cristiansep' 
//       });

//       var img = await cloudinary.uploader.upload(path);
//       console.log(img);
// }






function subirPorTipo(tipo, id, nombreArchivo, res){

    if(tipo === 'usuarios'){

        Usuario.findById(id, (err,usuario) =>{

            if(!usuario){
                return res.status(400).json({
                    ok: true,
                    mensaje: "Usuario no existe",
                    errors: {
                        message: 'Usuario no existe'
                    }
                  });
            }

            let pathViejo = './uploads/usuarios/' + usuario.img;

            // si existe una imagen anterios la elimina
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err,usuarioActualizado)=>{

                usuarioActualizado.password = ':)';

                   return res.status(200).json({
                       ok: true,
                       mensaje: "Imagen de usuario actualizada",
                       usuario: usuarioActualizado
                     });
            })

        });

    }

 


    // if(tipo === 'medicos'){
        
    //     Medico.findById(id, (err,medico) =>{

    //         if(!medico){
    //             return res.status(400).json({
    //                 ok: true,
    //                 mensaje: "Medico no existe",
    //                 errors: {
    //                     message: 'Medico no existe'
    //                 }
    //               });
    //         }

    //         let pathViejo = './uploads/medicos/' + medico.img;

    //         // si existe una imagen anterios la elimina
    //         if(fs.existsSync(pathViejo)){
    //             fs.unlinkSync(pathViejo);
    //         }

    //         medico.img = nombreArchivo;

    //         medico.save((err,medicoActualizado)=>{

    //                return res.status(200).json({
    //                    ok: true,
    //                    mensaje: "Imagen de medico actualizada",
    //                    medico: medicoActualizado
    //             });
    //         })

    //     });
    // }



    if(tipo === 'proyectos'){

          
        Proyecto.findById(id, (err,proyecto) =>{

            if(!proyecto){
                return res.status(400).json({
                    ok: true,
                    mensaje: "Proyecto no existe",
                    errors: {
                        message: 'Proyecto no existe'
                    }
                  });
            }

            let pathViejo = './uploads/proyectos/' + proyecto.img;

            // si existe una imagen anterios la elimina
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            proyecto.img = nombreArchivo;

            proyecto.save((err,proyectoActualizado)=>{

                   return res.status(200).json({
                       ok: true,
                       mensaje: "Imagen de proyecto actualizada",
                       proyecto: proyectoActualizado
                });
            })

        });
        
    }

}

module.exports = app;