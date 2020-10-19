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
        res.json({var:'archivo recibido'});
    }else{
        res.json({var:'Entrada incorrecta'});
    }
})

/*
router.post('/saludos',(req,res) => {
    res.json({saludo:'saludos desde nodejs'});
})
*/

router.get('/saludos',(req,res) => {
    res.json({saludo:'saludos desde nodejs'});
})

module.exports = router;