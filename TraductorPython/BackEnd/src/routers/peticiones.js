const { Router, json } = require('express');
const router = Router();
const lexico = require('../routers/Traductor/lexico');
const sintactico = require('../routers/Traductor/sintactico');

var data = '';
var traduccion;
var grafo = '';
var listaAnalisis = [];
var listatokens = [];
var listadoSintatico = [];
var listaErrores = [];

//envio de data para el retorno de reportes
router.post('/analizar',(req,res) =>{
    var code = req.body;
    data = code.codigo;
    var traduccion = 'class Prueba:\n\tprint(preuba de recivido);'
    var lex = new lexico();
    var sintatic = new sintactico();
    if(data){      
        listaAnalisis = lex.analizador(data);
        listatokens = listaAnalisis[0];
        listadoSintatico = listaAnalisis[1];
        listaErrores = listaAnalisis[2];

        var traduccion = sintatic.analisisSintactico(listadoSintatico);
        res.json({translation: traduccion});
    }else{
        res.json({translation:"Entrada incorrecta"});
    }
})

/*
*peticion para solicitar el listado de tokens obtenidos por el analisis json
*/
router.get('/listadoTokens',(req,res) => {
    res.send(listatokens);
})


/*
*peticion para solicitar el listado de todos los errores encontrados
*/
router.get('/listadoErrores',(req,res) =>{
    res.send(listaErrores);
})

/*
*peticion para solicitar el listado de tokens obtenidos por el analisis json
*/
router.get('/traductorPython',(req,res) => {
    
})

/*
*peticion para solicitar el listado de tokens obtenidos por el analisis json
*/
router.get('/saludosPython',(req,res) => {
    //res.send(listatokens);
    res.send('hola desde el servidor de python');
})

module.exports = router;