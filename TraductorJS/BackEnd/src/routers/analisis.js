const { Router, json } = require('express');
const router = Router();
const translation = require('./Traductor/analizador');
const tree = require('./Traductor/ast');

var data = '';
var traduccion;
var grafo = '';
var listaAnalisis = [];
var listatokens = [];
var listaErrores = [];
var listaComentarios = [];

// peticiones
router.post('/analizar',(req,res) =>{
    var code = req.body;
    data = code.codigo;
    if(data){        
        //obtencion y asignacion de resultados del analisis 
        translation.clearList();       
        listaAnalisis = translation.parse(data);
        //******************************/
        listatokens = listaAnalisis[0];            
        traduccion = listaAnalisis[1];
        listaErrores = listaAnalisis[2];
        listaComentarios = listaAnalisis[3];
        grafo = tree.parse(data);
        /*************************/
        //console.log(listatokens)
        //console.log(grafo);        
        //console.log(traduccion);
        //console.log(grafo);
        // respondiendo con la traduccion
        res.json({translation: traduccion});
    }else{
        res.json({translation:"Entrada incorrecta"});
    }
})

/*
*peticion para solicitar el listado de tokens obtenidos por el analisis json
*/
router.get('/listadoTokens',(req,res) => {
    //jsonarry = JSON.stringify(listatokens)
    //console.log(jsonarry)
    //res.json(jsonarry);
    //console.log(listatokens);
    res.send(listatokens);
})

/*
*peticion para solicitar el listado de todos los errores encontrados
*/
router.get('/listadoErrores',(req,res) =>{
    res.send(listaErrores);
})

/*
*peticion de la data para el grafico del arbol ast
*/
router.get('/dataTree',(req,res) =>{
    //jsonGrafo = JSON.stringify(grafo);
    //console.log(jsonGrafo)
    //console.log(grafo);
    res.send(grafo);
})

/*
*peticion de la data para el grafico del arbol ast
*/
router.get('/comentarios',(req,res) =>{
    res.send(listaComentarios);
})

/*
*peticion para prueba enviando un saludo en formato json como respuesta
*/
router.post('/saludos',(req,res) =>{
    var code = req.body;
    data = code.codigo;
    console.log(data);
    res.json({var:'He recibido la data para analizar'});
})

router.get('/saludos',(req,res) => {
    res.json({saludo:"saludos desde nodejs"});
})

module.exports = router;