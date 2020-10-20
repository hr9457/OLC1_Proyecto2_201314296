const { Router } = require('express');
const router = Router();
const translation = require('./Traductor/analizador');
const tree = require('./Traductor/ast');

var data = '';
var traduccion;
var grafo;
var listaAnalisis = [];
var listatokens;

// peticiones
router.post('/analizar',(req,res) =>{
    var code = req.body;
    data = code.codigo;
    if(data){
        listaAnalisis = translation.parse(data);
        listatokens = listaAnalisis[0];
        traduccion = listaAnalisis[1];
        grafo = tree.parse(data);
        /*************************/
         //console.log(grafo);
        console.log(listatokens);
        console.log(traduccion);
        console.log(grafo);
        // respondiendo con la traduccion
        res.json({translation: traduccion});
    }else{
        res.json({translation:"Entrada incorrecta"});
    }
})

/*
router.post('/saludos',(req,res) => {
    res.json({saludo:'saludos desde nodejs'});
})
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