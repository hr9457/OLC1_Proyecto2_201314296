/**
 * utilidades
 */
var cadena = '';
var puntero = 0;
var estado = 0;
var fila = 1;
var columna = 0;
var token = '';
var caracter = '';
var listaTokens = [];
var listaTokens2 = [];
var listadoErrores = [];
var traduccion = [];
var palabrasReservadas = ['public','class','main','interface','void','static','int'
,'double','char','boolean','true','false','String','for','while','do','if','else','break'
,'continue','return','System','out','print','println'];
//para analisis sintactico
var tokenPreanalisis;
var valorPreanalisis;
var posicionLista=0;


/**
 * metodo para agregar a sus respectivas listas
 */
function addToken(fila,columna,tipo,token){
    listaTokens.push({Fila:fila,Columna:columna,Tipo:tipo,Token:token});
}

function addToken2(tipo,token)
{
    listaTokens2.push({Tipo:tipo,Token:token});
}


function addError(tipo,fila,columna,descripcion){
    listadoErrores.push({Tipo:tipo,Fila:fila,Columna:columna,Descripcion:descripcion});
}

function addTraduccion(token){
    traduccion.push({Token:token});
}

/*
*metodo de verificacion en codigo ascii
*/
function isLetter(caracter){
    if((caracter >= 65 && caracter <= 90)
    || (caracter >= 97 && caracter <= 122)){
        return true;
    }
    else{
        return false;
    }
}

function isNumber(caracter){
    if(caracter >= 48 && caracter <= 57){
        return true;
    }
    else{
        return false;
    }
}

function isSymbol(caracter){
    if(caracter==33//!
        ||caracter==38//&
        ||caracter==40//(
        ||caracter==41//)
        ||caracter==42//*
        ||caracter==43//+
        ||caracter==44//,
        ||caracter==45//-
        ||caracter==46//.
        ||caracter==59//;
        ||caracter==60//<
        ||caracter==61//=
        ||caracter==62//>
        ||caracter==91//[
        ||caracter==93//]
        ||caracter==94//^
        ||caracter==123//{
        ||caracter==124//|
        ||caracter==125//}
        ){
        return true;
    }
    else{
        return false;
    }
}

/*
*analisis lexico
*/
function analizador(cadena){
    this.cadena = cadena;
    //console.log(this.cadena);
    //recorrido de toda la cadena
    while(puntero<this.cadena.length){
        this.caracter = cadena[puntero];
        //
        switch(estado){
            //estado de simbolos
            case 0:
                if(isSymbol(caracter.charCodeAt(0))){
                    addToken(fila,columna,'Simbolo',caracter);
                    addToken2(caracter,caracter);
                    columna++;
                }
                else if(isLetter(caracter.charCodeAt(0))
                ||caracter.charCodeAt(0)==95){//_
                    this.token += caracter;
                    this.estado = 1;
                }
                else if(isNumber(caracter.charCodeAt(0))){
                    this.token += caracter;
                    this.estado = 2;
                }
                else if(caracter.charCodeAt(0)==34){//""
                    this.token += caracter;
                    this.estado = 5;
                }
                else if(caracter.charCodeAt(0)==39){//'
                    this.token += caracter;
                    this.estado = 8;
                }
                else if(caracter.charCodeAt(0)==47)// /
                {
                    this.token += caracter;
                    this.estado = 11;
                    //console.log(token);
                }
                else if(caracter.match(/\s+/)){//espacios varios
                    //console.log('epsacio');
                }
                else{
                    addError('lexico',fila,columna,'El caracter '+caracter+' no pertenece al lenguaje');
                    columna++;
                }
                break;
            //
            case 1:
                if(isLetter(caracter.charCodeAt(0))
                ||isNumber(caracter.charCodeAt(0))
                ||caracter.charCodeAt(0)==95){                    
                    this.token += caracter; 
                    this.estado = 1;       
                }
                else{
                    if(palabrasReservadas.includes(token)){
                        addToken(fila,columna,'reservada',token);
                        addToken2(token,token);
                    }else{
                        addToken(fila,columna,'ID',token);
                        addToken2('id',token);
                    }
                    //console.log(token);
                    this.token = '';
                    this.columna++;
                    this.estado=0;
                    this.puntero--;
                }
                break;
            //
            case 2:
                if(isNumber(caracter.charCodeAt(0))){
                    this.token += caracter;
                }
                else if(caracter.charCodeAt(0)==46){
                    this.token += caracter;
                    this.estado = 3;
                }
                else{
                    addToken(fila,columna,'Digito',token);
                    addToken2('digito',token);
                    this.token='';
                    this.columna++;
                    this.estado=0;
                    this.puntero--;
                }
                break;
            //
            case 3:
                if(isNumber(caracter.charCodeAt(0))){
                    this.token += caracter;
                    this.estado=4;
                }
                else{
                    addError('lexico',fila,columna,'El caracter '+token+' no pertenece al lenguaje');
                    this.token='';
                    columna++;
                    this.estado=0;
                    this.puntero--;
                }
                break;
            //
            case 4:
                if(isNumber(caracter.charCodeAt(0))){
                    this.token += caracter;
                }
                else{
                    addToken(fila,columna,'Decimal',token);
                    addToken2('decimal',token);
                    this.token='';
                    this.columna++;
                    this.estado=0;
                    this.puntero--;
                }
                break;
            //String
            case 5:
                if(caracter.charCodeAt(0)==34){//""
                    this.token += caracter;
                    this.estado =  7;
                }
                else if(caracter == '\n'){
                    addError('lexico',fila,columna,'El caracter '+token+' no pertenece al lenguaje');
                    this.token = '';
                    columna++;
                    this.estado=0;
                    this.puntero--;
                }
                else{
                    this.token += caracter;
                    this.estado = 6;
                }
                break;
            //
            case 6:
                if(caracter.charCodeAt(0)==34){//""
                    this.token += caracter;
                    this.estado = 7;
                }
                else if(caracter == '\n'){
                    addError('lexico',fila,columna,'El caracter '+token+' no pertenece al lenguaje');
                    this.token = '';
                    columna++;
                    this.estado=0;
                    this.puntero--;
                }
                else{
                    this.token += caracter;
                }
                break;
            //
            case 7:
                addToken(fila,columna,'string',token);
                addToken2('stringCadena',token);
                this.token='';
                this.columna++;
                this.estado=0;
                this.puntero--;
                break;
            //
            case 8:
                if(caracter.charCodeAt(0)==39){//'
                    this.token += caracter;
                    this.estado = 10;
                }
                else if(caracter == '\n')
                {
                    addError('lexico',fila,columna,'El caracter '+token+' no pertenece al lenguaje');
                    this.token = '';
                    columna++;
                    this.estado=0;
                    this.puntero--;
                }
                else
                {
                    this.token += caracter;
                    this.estado = 9;
                }
                break;
            //
            case 9:
                if(caracter.charCodeAt(0)==39){//'
                    this.token += caracter;
                    this.estado = 10;
                }
                else if(caracter == '\n')
                {
                    addError('lexico',fila,columna,'El caracter '+token+' no pertenece al lenguaje');
                    this.token = '';
                    columna++;
                    this.estado=0;
                    this.puntero--;
                }
                else
                {
                    this.token += caracter;
                }
                break;
            //
            case 10:
                addToken(fila,columna,'Char',token);
                addToken2('charCadena',token);
                this.token='';
                this.columna++;
                this.estado=0;
                this.puntero--;
                break;
            //
            case 11:
                if(caracter.charCodeAt(0)==47){// /
                    this.token += caracter;
                    this.estado = 12;
                    //console.log(token);
                }
                else if(caracter.charCodeAt(0)==42)//*
                {
                    this.token += caracter;
                    this.estado = 13;
                }
                else
                {
                    addToken(fila,columna,'Simbolo',token);
                    addToken2(token,token);
                    this.token='';
                    this.columna++;
                    this.estado=0;
                    this.puntero--;
                }
                break;
            //
            case 12:
                if(caracter != '\n')
                {
                    this.token += caracter;
                }
                else
                {
                    addToken(fila,columna,'Comentario',token);
                    this.token='';
                    this.columna++;
                    this.estado=0;
                    this.puntero--;
                }
                break;
            //
            case 13:
                if(caracter.charCodeAt(0)!=42)//*
                {
                    this.token += caracter;
                }
                else
                {
                    this.token += caracter;
                    this.estado = 14;
                }
                break;
            //
            case 14:
                if(caracter.charCodeAt(0)==47)// /
                {
                    this.token += caracter;
                    addToken(fila,columna,'Comentario',token);
                    this.token='';
                    this.columna++;
                    this.estado=0;
                }
                else if(caracter.charCodeAt(0)==42)//*
                {
                    this.token += caracter;
                }
                else 
                {
                    this.token += caracter;
                    this.estado = 13;
                }
                break;
        }
        //
        this.puntero++;
    }
    /*
    *
    */
    addToken2('UltimoToken','');  
    console.log(listaTokens);  
    return listaTokens 
    /*
    *llamada al analisis sintactico
    */
    //tokenPreanalisis = listaTokens2[0].Tipo;
    //valorPreanalisis = listaTokens2[0].Token;
    //console.log(tokenPreanalisis);
    analisisSintactico();//      
    //this.puntero=0;
}



/*****************************************************************************************/
/**
 *************************************************************segundo metodo match
 */
function match(token)
{
    if(token!=tokenPreanalisis)
    {
        //console.log('T envio:'+token+' diferente A: '+tokenPreanalisis);
        return false;
    }
    else
    {
        token = tokenPreanalisis;
        //console.log("Token: "+token+" hizo match con: "+tokenPreanalisis);
        posicionLista++;
        tokenPreanalisis = listaTokens2[posicionLista].Tipo;
        valorPreanalisis = listaTokens2[posicionLista].Token;
        return true;
    }
}


/**
 ****************************************************estado de error
 */
function error()
{
    //RECUPERACION ERROR
    while(tokenPreanalisis!='}')
    {
        posicionLista++;
        tokenPreanalisis = listaTokens2[posicionLista].Tipo;
        valorPreanalisis = listaTokens2[posicionLista].Token;
    }
}


/*
*********************************************** analisis sintactico
*/
function analisisSintactico()
{
    console.log("inicio sintactico");
    var java = java2();//llamado a todo lo que acepta java
    console.log(java);
}

/**
 ******************************************* revision si existen tokens para analizar
 */
function java2()
{
    switch(listaTokens2[posicionLista].Tipo)
    {
        case 'public':
            match('public');
            var clase = clase_interface();
            if(listaTokens2[posicionLista].Tipo=='public')
            {
                var recursividadJAVA = java2();
                return ''+clase+'\n\n'+recursividadJAVA;
            }
            return ''+clase;
        default:
            return false;
    }
}

/**
 ***************************************** Decision entre clase o interface 
 */
function clase_interface()
{
    switch(listaTokens2[posicionLista].Tipo)
    {
        case 'class':
            if(match('class')==false){break;}
            var id = listaTokens2[posicionLista].Token;
            if(match('id')==false){break;}
            if(match('{')==false){break;}
            var bloque = bloqueInstruccionClase();
            if(match('}')==false){break;}
            return 'class '+id+':\n'+bloque;

        case 'interface':
            if(match('interface')==false){break;}
            var id = listaTokens2[posicionLista].Token;
            if(match('id')==false){break;}
            if(match('{')==false){break;}
            var bloque = bloqueInstruccionInterfaze();
            if(match('}')==false){break;}
            return 'class '+id+':\n'+bloque;
        default:
            return false;
    }
}

/**
 * bloque de instrucciones permitidas dentro de una clase
 */
function bloqueInstruccionInterfaze()
{
    if(listaTokens2[posicionLista].Tipo=='public')
    {
        var retornoMETODOINT = metodosInterface();
        //recursividad
        if(listaTokens2[posicionLista].Tipo=='public')
        {
            var bloqueRecursivoInterfaze = bloqueInstruccionInterfaze();
            return '\t'+retornoMETODOINT+'\n'+bloqueRecursivoInterfaze;
        }
        return '\t'+retornoMETODOINT;
    }
    else
    {
        return '';
    }
}

function metodosInterface()
{
    match('public');
    tipoRetorno();
    var identificador = listaTokens2[posicionLista].Token;
    match('id');
    match('(');
    if(listaTokens2[posicionLista].Tipo==')')
    {
        match(')');
        match(';');
        return 'self '+identificador+' ();';
    }
    else 
    {
        var parametros = parametroJava();
        match(')');
        match(';');
        return 'self '+identificador+' ('+parametros+');';
    }
}


/**
 * bloque de instrucciones permitidas dentro de una clase
 */
function bloqueInstruccionClase()
{
    if(listaTokens2[posicionLista].Tipo=='public')
    {
        match('public');
        if(listaTokens2[posicionLista].Tipo=='static')
        {//metodo main

            var funcionMain = metodoMain();
            //recursividad
            if(listaTokens2[posicionLista].Tipo=='public'||listaTokens2[posicionLista].Tipo=='id'
            ||listaTokens2[posicionLista].Tipo=='System'||tipoVariable()!=false)
            {
                var bloque = bloqueInstruccionClase();
                return '\t'+funcionMain+'\n'+bloque;
            }
            return '\t'+funcionMain;

        }
        else
        {//metodos o funciones

            var funcionOmetodo = funcion_MetodoJava();
            //recursividad
            if(listaTokens2[posicionLista].Tipo=='public'||listaTokens2[posicionLista].Tipo=='id'
            ||listaTokens2[posicionLista].Tipo=='System'||tipoVariable()!=false)
            {
                var bloque = bloqueInstruccionClase();
                return '\t'+funcionOmetodo+'\n'+bloque;
            }
            return '\t'+funcionOmetodo;

        }

    }    
    else if(listaTokens2[posicionLista].Tipo=='id')
    {//asignaciones a variables
        var retornoAsignacion = asignacionA();

        //recursividad
        if(listaTokens2[posicionLista].Tipo=='public'||listaTokens2[posicionLista].Tipo=='id'
        ||listaTokens2[posicionLista].Tipo=='System'||tipoVariable()!=false)
        {
            var bloque = bloqueInstruccionClase();
            return '\t'+retornoAsignacion+'\n'+bloque;
        }

        return '\t'+retornoAsignacion;
    }
    else if(existeTipoVariable()!=false)
    {//variabale en java
        var retornoVariable = variables();
        //recursividad
        if(listaTokens2[posicionLista].Tipo=='public'||listaTokens2[posicionLista].Tipo=='id'
        ||listaTokens2[posicionLista].Tipo=='System'||existeTipoVariable()!=false)
        {
            var bloque = bloqueInstruccionClase();
            return '\t'+retornoVariable+'\n'+bloque;
        }

        return '\t'+retornoVariable;
    }
    else
    {
        return '';
    }
}


/**
 * metodo main aceptado en java
 */
function metodoMain()
{
    match('static');
    match('void');
    match('main');
    match('(');
    match('String');
    match('[');
    match(']');
    var identificador = listaTokens2[posicionLista].Token;
    match('id');
    match(')');
    match('{');
    //posibilidad de que el main vengo o no con instrucciones
    if(listaTokens2[posicionLista].Tipo=='}')
    {
        match('}');
        return 'def main():';
    }
    else
    {
        var BLOQUEMAIN = bloqueInstuccionMain();
        match('}');
        return 'def main():\n\t'+BLOQUEMAIN;
    }    
}

/**
 * bloque de instruccines permitidas dentro del metodo main
 */
function  bloqueInstuccionMain()
{
    if(listaTokens2[posicionLista].Tipo=='id')
    {//asignacionesA,llamada a un metodo,incremento o decremento
        
        var retornoSUB = subBloque();

        //recursividad
        if(listaTokens2[posicionLista].Tipo=='id'||listaTokens2[posicionLista].Tipo=='if'
        ||listaTokens2[posicionLista].Tipo=='for'||listaTokens2[posicionLista].Tipo=='while'
        ||listaTokens2[posicionLista].Tipo=='do'||listaTokens2[posicionLista].Tipo=='System'
        ||listaTokens2[posicionLista].Tipo=='while'||listaTokens2[posicionLista].Tipo=='break'
        ||listaTokens2[posicionLista].Tipo=='continue'||listaTokens2[posicionLista].Tipo=='return'
        ||tipoVariable()!=false)
        {
            var BLOQUE = bloqueInstuccionMain();
            return '\t'+retornoSUB+'\n\t'+BLOQUE;
        }
        return '\t'+retornoSUB;

    }
    else if(listaTokens2[posicionLista].Tipo=='if')
    {
        var retornoIF = funcionIFELSE();
        
        //recursividad
        if(listaTokens2[posicionLista].Tipo=='id'||listaTokens2[posicionLista].Tipo=='if'
        ||listaTokens2[posicionLista].Tipo=='for'||listaTokens2[posicionLista].Tipo=='while'
        ||listaTokens2[posicionLista].Tipo=='do'||listaTokens2[posicionLista].Tipo=='System'
        ||listaTokens2[posicionLista].Tipo=='while'||listaTokens2[posicionLista].Tipo=='break'
        ||listaTokens2[posicionLista].Tipo=='continue'||listaTokens2[posicionLista].Tipo=='return'
        ||tipoVariable()!=false)
        {
            var BLOQUE = bloqueInstuccionMain();
            return '\t'+retornoIF+'\n\t'+BLOQUE;
        }
        return '\t'+retornoIF;

    }
    else if(listaTokens2[posicionLista].Tipo=='for')
    {
        var retornoFOR = funcionFor();
        
        //recursividad
        if(listaTokens2[posicionLista].Tipo=='id'||listaTokens2[posicionLista].Tipo=='if'
        ||listaTokens2[posicionLista].Tipo=='for'||listaTokens2[posicionLista].Tipo=='while'
        ||listaTokens2[posicionLista].Tipo=='do'||listaTokens2[posicionLista].Tipo=='System'
        ||listaTokens2[posicionLista].Tipo=='while'||listaTokens2[posicionLista].Tipo=='break'
        ||listaTokens2[posicionLista].Tipo=='continue'||listaTokens2[posicionLista].Tipo=='return'
        ||tipoVariable()!=false)
        {
            var BLOQUE = bloqueInstuccionMain();
            return '\t'+retornoFOR+'\n\t'+BLOQUE;
        }
        return '\t'+retornoFOR;

    }
    else if(listaTokens2[posicionLista].Tipo=='while')
    {
        var retornoWHILE = funcionWhile();
        
        //recursividad
        if(listaTokens2[posicionLista].Tipo=='id'||listaTokens2[posicionLista].Tipo=='if'
        ||listaTokens2[posicionLista].Tipo=='for'||listaTokens2[posicionLista].Tipo=='while'
        ||listaTokens2[posicionLista].Tipo=='do'||listaTokens2[posicionLista].Tipo=='System'
        ||listaTokens2[posicionLista].Tipo=='while'||listaTokens2[posicionLista].Tipo=='break'
        ||listaTokens2[posicionLista].Tipo=='continue'||listaTokens2[posicionLista].Tipo=='return'
        ||tipoVariable()!=false)
        {
            var BLOQUE = bloqueInstuccionMain();
            return '\t'+retornoWHILE+'\n\t'+BLOQUE;
        }
        return '\t'+retornoWHILE;

    }
    else if(listaTokens2[posicionLista].Tipo=='do')
    {
        var retornoDOWHILE = funcionDoWhile();
        
        //recursividad
        if(listaTokens2[posicionLista].Tipo=='id'||listaTokens2[posicionLista].Tipo=='if'
        ||listaTokens2[posicionLista].Tipo=='for'||listaTokens2[posicionLista].Tipo=='while'
        ||listaTokens2[posicionLista].Tipo=='do'||listaTokens2[posicionLista].Tipo=='System'
        ||listaTokens2[posicionLista].Tipo=='while'||listaTokens2[posicionLista].Tipo=='break'
        ||listaTokens2[posicionLista].Tipo=='continue'||listaTokens2[posicionLista].Tipo=='return'
        ||tipoVariable()!=false)
        {
            var BLOQUE = bloqueInstuccionMain();
            return '\t'+retornoDOWHILE+'\n\t'+BLOQUE;
        }
        return '\t'+retornoDOWHILE;

    }
    else if(listaTokens2[posicionLista].Tipo=='System')
    {
        var retornoIMPRESION = impresiones();
        
        //recursividad
        if(listaTokens2[posicionLista].Tipo=='id'||listaTokens2[posicionLista].Tipo=='if'
        ||listaTokens2[posicionLista].Tipo=='for'||listaTokens2[posicionLista].Tipo=='while'
        ||listaTokens2[posicionLista].Tipo=='do'||listaTokens2[posicionLista].Tipo=='System'
        ||listaTokens2[posicionLista].Tipo=='while'||listaTokens2[posicionLista].Tipo=='break'
        ||listaTokens2[posicionLista].Tipo=='continue'||listaTokens2[posicionLista].Tipo=='return'
        ||tipoVariable()!=false)
        {
            var BLOQUE = bloqueInstuccionMain();
            return '\t'+retornoIMPRESION+'\n\t'+BLOQUE;
        }
        return '\t'+retornoIMPRESION;

    }
    else if(listaTokens2[posicionLista].Tipo=='break'||listaTokens2[posicionLista].Tipo=='continue'
    ||listaTokens2[posicionLista].Tipo=='return')
    {
        var retornoQUIEBRE = retornos();
        
        //recursividad
        if(listaTokens2[posicionLista].Tipo=='id'||listaTokens2[posicionLista].Tipo=='if'
        ||listaTokens2[posicionLista].Tipo=='for'||listaTokens2[posicionLista].Tipo=='while'
        ||listaTokens2[posicionLista].Tipo=='do'||listaTokens2[posicionLista].Tipo=='System'
        ||listaTokens2[posicionLista].Tipo=='while'||listaTokens2[posicionLista].Tipo=='break'
        ||listaTokens2[posicionLista].Tipo=='continue'||listaTokens2[posicionLista].Tipo=='return'
        ||tipoVariable()!=false)
        {
            var BLOQUE = bloqueInstuccionMain();
            return '\t'+retornoQUIEBRE+'\n\t'+BLOQUE;
        }
        return '\t'+retornoQUIEBRE;

    }
    else if(existeTipoVariable()!=false)
    {
        var retornoVariable = variables();
        
        //recursividad
        if(listaTokens2[posicionLista].Tipo=='id'||listaTokens2[posicionLista].Tipo=='if'
        ||listaTokens2[posicionLista].Tipo=='for'||listaTokens2[posicionLista].Tipo=='while'
        ||listaTokens2[posicionLista].Tipo=='do'||listaTokens2[posicionLista].Tipo=='System'
        ||listaTokens2[posicionLista].Tipo=='while'||listaTokens2[posicionLista].Tipo=='break'
        ||listaTokens2[posicionLista].Tipo=='continue'||listaTokens2[posicionLista].Tipo=='return'
        ||existeTipoVariable()!=false)
        {
            var BLOQUE = bloqueInstuccionMain();
            return '\t'+retornoVariable+'\n\t'+BLOQUE;
        }
        return '\t'+retornoVariable;
    }
    else
    {
        return '';
    }
}


/**
 * para funciones y metodos aceptados en java
 */
function funcion_MetodoJava()
{
    tipoRetorno();
    var identificador = listaTokens2[posicionLista].Token;
    match('id');
    match('(');
    /**
     * revision de entrada de parametros
     * 1. sin parametros 
     * 2. con parametros
     */
    if(listaTokens2[posicionLista].Tipo==')')
    {
        match(')');
        if(listaTokens2[posicionLista].Tipo=='{')//funcion
        {
            match('{');
            if(listaTokens2[posicionLista.Tipo=='}'])
            {
                match('}');
                return 'def '+identificador+' ():';
            }
            else
            {
                var bloqueInstru = bloqueInstuccionMain();
                match('}');
                return 'def '+identificador+' ():\n\t'+bloqueInstru;
            }
        }
        else if(listaTokens2[posicionLista].Tipo==';')//metodo
        {
            match(';');
            return 'self '+identificador+' ();';
        }

    }
    else
    {
        var parametros = parametroJava();
        match(')');
        if(listaTokens2[posicionLista].Tipo=='{')//funcion
        {            
            match('{');
            if(listaTokens2[posicionLista].Tipo=='}')
            {
                match('}');
                return 'def '+identificador+' ( '+parametros+' ):';
            }
            else
            {   
                var bloqueInstru = bloqueInstuccionMain();
                match('}');
                return 'def '+identificador+' ():\n\t'+bloqueInstru;             
            }            
        }
        else if(listaTokens2[posicionLista].Tipo==';')//metodo
        {
            match(';');
            return 'self '+identificador+' ( '+parametros+' );';
        }

    } 
}


/**
 * metod para llamar a una llamada a metodo o incremento o decremento, asignacion A
 */
function subBloque()
{
    var identificador = listaTokens2[posicionLista].Token;
    match('id');
    if(listaTokens2[posicionLista].Tipo=='=')
    {
        match('=');
        var exp = expresion();
        match(';');
        return ''+identificador+'='+exp;
    }
    else if(listaTokens2[posicionLista].Tipo=='(')
    {
        match('(');
        if(listaTokens2[posicionLista].Tipo==')')
        {
            match(')');
            match(';');
            return ''+identificador+'()';
        }
        else
        {
            var retornoPARAMETROS = parametroJava();
            match(')');
            match(';');
            return ''+identificador+'('+retornoPARAMETROS+')';
        } 
    }
    else if(listaTokens2[posicionLista].Tipo=='+')
    {   
        match('+');
        match('+');
        match(';');
        return ''+identificador+'++';        
    }
    else if(listaTokens2[posicionLista].Tipo=='-')
    {   
        match('-');
        match('-');
        match(';');
        return ''+identificador+'--';        
    }
    else
    {
        return ''
    }
}


/**
 * estrutura de una llamada a un metodo en java
 */
function funcionLlamadaMetodo()
{
    var identificador = listaTokens2[posicionLista].Token;
    match('id');
    match('(');
    if(listaTokens2[posicionLista].Tipo==')')
    {
        match(')');
        match(';');
        return ''+identificador+'()';
    }
    else
    {
        var retornoPARAMETROS = parametroJava();
        match(')');
        match(';');
        return ''+identificador+'('+retornoPARAMETROS+')';
    }    
}

function incrementoDecremento()
{
    var identificador = listaTokens2[posicionLista].Token;
    match('id');
    if(listaTokens2[posicionLista].Tipo=='+')
    {        
        match('+');
        match('+');
        return identificador+'++';
    }
    else
    {
        match('-');
        match('-');
        return identificador+'--';
    }
}

/**
 * parametros para metodos y funciones
 */
function parametroJava()
{
    var tipo = tipoVariable();
    var identificador = listaTokens2[posicionLista].Token;
    match('id');
    if(listaTokens2[posicionLista].Token==',')
    {
        match(',');
        var parametro = parametroJava();
        return identificador+','+parametro;
    }
    return ''+identificador;
}

/**
 * asignaciones a variables permitidas dentro de java
 */
function asignacionA()
{
    var identificador = listaTokens2[posicionLista].Token;
    match('id');
    match('=');
    var exp = expresion();
    match(';');
    return identificador+'='+exp;
}

//TODO: modifique a la hora de aceder al tipo de variable
/**
 * Estructura de variables aceptadas
 */
function variables()
{
    var tipo = tipoVariable();
    var declaRacion = declaracion();
    match(';');
    return 'var '+declaRacion;
}

/**
 **  declaracion  que pueden llevar una variable
 */
function declaracion()
{
    var asigNacion = asignacion();
    if(listaTokens2[posicionLista].Tipo==',')
    {
        match(',');
        var asignacionMulti = declaracion();
        return asigNacion +','+asignacionMulti;
    }
    return ''+asigNacion;
}


/**
 **  asignaciones a una variable
 */
function asignacion()
{
    var identificador = listaTokens2[posicionLista].Token;
    match('id');
    if(listaTokens2[posicionLista].Tipo=='=')
    {
        match('=');
        var exp = expresion();
        return ''+identificador+'='+exp;
    }
    else
    {
        return ''+identificador;
    }    
}

/**
 * funcion while aceptada en java
 */
function funcionWhile()
{
    match('while');
    match('(');
    var exp = expresion();
    match(')');
    match('{');
    if(listaTokens2[posicionLista].Tipo=='}')
    {
        match('}');
        return 'while '+exp+':';
    }  
    else
    {
        var bloque = bloqueInstuccionMain();
        match('}');
        return 'while '+exp+':\n\t'+bloque;
    }  
}

/**
 * funcion do while aceptada en java
 */
function funcionDoWhile()
{
    match('do');
    match('{');
    if(listaTokens2[posicionLista].Tipo=='}')
    {
        match('}')
        match('while');
        match('(');
        var exp = expresion();
        match(')');
        match(';');
        return 'while '+exp+':';
    }
    else
    {
        var bloqueInstru = bloqueInstuccionMain();
        match('}')
        match('while');
        match('(');
        var exp = expresion();
        match(')');
        match(';');
        return 'while '+exp+':\n\t'+bloqueInstru;
    }    
}


/**
 * estructura de un funcion for aceptada en java
 */
function funcionFor()
{
    match('for');
    match('(');
    var declaracion = dec();
    match(';');
    var exp = expresion();
    match(';');
    var exp2 = expresion();
    match(')');
    match('{');
    if(listaTokens2[posicionLista].Tipo=='}')
    {
        match('}');
        return 'for '+declaracion+' in range ('+exp+','+exp2+'):';
    }
    else
    {
        var bloqueInstru = bloqueInstuccionMain();
        match('}');
        return 'for '+declaracion+' in range ('+exp+','+exp2+'):\n\t\t'+bloqueInstru;
    }    
}

/**
 * sintaxis de una declaracion para el ciclo for
 */
function dec()
{
    if(listaTokens2[posicionLista].Tipo=='id')
    {
        var identificador = listaTokens2[posicionLista].Token;
        match('id');
        if(listaTokens2[posicionLista].Tipo=='=')
        {
            match('=');
            var vaLor = valor();
            return ''+identificador+'='+vaLor;
        }    
        return ''+identificador; 
    }     
    else 
    {
        var tipo = tipoVariable();
        var identificador = listaTokens2[posicionLista].Token;
        match('id');
        match('=');
        var vaLor = valor();
        return ''+identificador+'='+vaLor;
    }
}

/**
 * estructura de una funcion if aceptda en java
 */
function funcionIFELSE()
{
    var restuldoif = funcionIF();
    if(listaTokens2[posicionLista].Tipo=='else')
    {
        var resultadoElif = funcionELSE_ELIF();
        return ''+restuldoif+'\n\t\t'+resultadoElif;
    }
    return ''+restuldoif;
}

/**
 * parte superrio de un if
 */
function funcionIF()
{
    match('if');
    match('(');
    var retornoExpression = expresion();
    match(')');
    match('{');
    if(listaTokens2[posicionLista].Tipo=='}')
    {
        match('}');
        return 'if '+retornoExpression+':';
    }
    else
    {
        var bloqueInstru = bloqueInstuccionMain();
        match('}');
        return 'if '+retornoExpression+':\n\t\t'+bloqueInstru;
    }
}

/**
 * estructrua de  else 
 */
function funcionELSE_ELIF()
{
    match('else');
    //si viene un else if
    if(listaTokens2[posicionLista].Tipo=='if')
    {
        var retornoELSEIF = funcionELIF();
        if(listaTokens2[posicionLista].Tipo=='else')
        {
            var retornoRECURSIVO = funcionELSE_ELIF();
            return ''+retornoELSEIF+'\n\t\t'+retornoRECURSIVO;
        }
        return ''+retornoELSEIF;
    }
    var retornoElse = funcionELSE();
    return ''+retornoElse;
}

/**
 * agreacion para un else if dentro del if
 */
function funcionELIF()
{
    match('if');
    match('(');
    var retornoExpression = expresion();
    match(')');
    match('{');
    if(listaTokens2[posicionLista].Tipo=='}')
    {
        match('}');
        return 'elif '+retornoExpression+':';
    }
    else
    {
        var bloqueInstru = bloqueInstuccionMain();
        match('}');
        return 'elif '+retornoExpression+':\n\t\t'+bloqueInstru;      
    }    
}

/**
 * agregacion else para un if
 */
function funcionELSE()
{
    match('{');
    if(listaTokens2[posicionLista].Tipo=='}')
    {
        match('}');
        return 'else:';
    }
    else
    {
        var bloqueInstru = bloqueInstuccionMain();
        match('}');
        return 'else :\n\t\t'+bloqueInstru;      
    }     
}


/**
 * impresiones por consola aceptadas en java
 */
function impresiones()
{
    match('System');
    match('.');
    match('out');
    match('.');
    if(listaTokens2[posicionLista].Tipo=='print')
    {
        match('print');
        match('(');
        var retornoExpresion = expresion();
        match(')');
        match(';');
        return 'print( '+retornoExpresion+' )';
    }
    else if(listaTokens2[posicionLista].Tipo=='println')
    {
        match('println');
        match('(');
        var retornoExpresion = expresion();
        match(')');
        match(';');
        return 'print( '+retornoExpresion+' )';
    }    
}

/**
 * tipos de retornos para funciones y otros
 */
function retornos()
{
    switch(listaTokens2[posicionLista].Tipo)
    {
        case 'break':
            match('break');
            match(';');
            return 'break';
        case 'continue':
            match('continue');
            match(';');
            return 'continue';
        case 'return':
            match('return');
            if(listaTokens2[posicionLista].Tipo==';')
            {match(';'); return 'return';}
            else{var retornoExpresion = expresion(); match(';');return 'return '+retornoExpresion;}
        default:
            return false;
    }
}



//TODO:falta agregar icremento y decremento
/**
 ** tipos de expresiones aceptadas en java
 */
function expresion()
{
    if(listaTokens2[posicionLista].Tipo=='!')
    {
        match('!');
        var exp = expresion()
        return 'not '+exp;        
    }
    else if(listaTokens2[posicionLista].Tipo=='(')
    {
        match('(');
        var exp = expresion();
        match(')');
        return '('+exp+')';
    }
    else if(listaTokens2[posicionLista].Tipo=='-')
    {
        match('-');
        var exp = expresion();
        if(exp=='false')
        {
            return '-';
        }
        return '-'+exp;
    }
    else
    {
        var vaLor = valor();
        if(listaTokens2[posicionLista].Tipo=='&')
        {
            match('&');
            match('&');
            var exp = expresion();
            return ''+vaLor+' and '+exp;
        }
        else if(listaTokens2[posicionLista].Tipo=='|')
        {
            match('|');
            match('|');
            var exp = expresion();
            return ''+vaLor+' or '+exp;
        }
        else if(listaTokens2[posicionLista].Tipo=='^')
        {
            match('^');
            var exp = expresion();
            return ''+vaLor+' xor '+exp;
        }
        else if(listaTokens2[posicionLista].Tipo=='>')
        {
            match('>');
            if(listaTokens2[posicionLista].Tipo=='=')
            {
                match('=');
                var exp = expresion();
                return ''+vaLor+' >= '+exp;
            }
            else
            {
                var exp = expresion();
                return ''+vaLor+' > '+exp;
            }
        }
        else if(listaTokens2[posicionLista].Tipo=='<')
        {
            match('<');
            if(listaTokens2[posicionLista].Tipo=='=')
            {
                match('=');
                var exp = expresion();
                return ''+vaLor+' <= '+exp;
            }
            else
            {
                var exp = expresion();
                return ''+vaLor+' < '+exp;
            }            
        }
        else if(listaTokens2[posicionLista].Tipo=='=')
        {
            match('=');
            match('=');
            var exp = expresion();
            return ''+vaLor+' == '+exp;
        }
        else if(listaTokens2[posicionLista].Tipo=='!')
        {
            match('!');
            match('=');
            var exp = expresion();
            return ''+vaLor+' != '+exp;
        }
        else if(listaTokens2[posicionLista].Tipo=='+')
        {
            match('+');
            if(listaTokens2[posicionLista].Tipo=='+')
            {
                match('+');
                return ''+vaLor+'++';
            }
            var exp = expresion();
            return ''+vaLor+'+'+exp;
        }
        else if(listaTokens2[posicionLista].Tipo=='-')
        {
            match('-');
            var exp = expresion();
            return ''+vaLor+'-'+exp;
        }
        else if(listaTokens2[posicionLista].Tipo=='*')
        {
            match('*');
            var exp = expresion();
            return ''+vaLor+'*'+exp;
        }
        else if(listaTokens2[posicionLista].Tipo=='/')
        {
            match('/');
            var exp = expresion();
            return ''+vaLor+'/'+exp;
        }
        return ''+vaLor; 
    }
}

/**
 ************************************************** tipos de variables aceptadas
 */
function existeTipoVariable()
{
    switch(listaTokens2[posicionLista].Tipo)
    {
        case 'int':
            return true;
        case 'boolean': 
            return true;
        case 'double':
            return true;
        case 'String':
            return true;
        case 'char':
            return true;
        default:
            return false;
    }
}

function tipoVariable()
{
    switch(listaTokens2[posicionLista].Tipo)
    {
        case 'int':
            match('int');
            return true;
        case 'boolean': 
            match('boolean');
            return true;
        case 'double':
            match('double');
            return true;
        case 'String':
            match('String');
            return true;
        case 'char':
            match('char');
            return true;
        default:
            return false;
    }
}

/**
 ** valores aceptados en java
 */
function valor()
{
    switch(listaTokens2[posicionLista].Tipo)
    {
        case 'digito':
            var vaLor = listaTokens2[posicionLista].Token;
            match('digito');
            return ''+vaLor;
        case 'decimal':
            var vaLor = listaTokens2[posicionLista].Token; 
            match('decimal');
            return ''+vaLor;
        case 'stringCadena': 
            var vaLor = listaTokens2[posicionLista].Token;
            match('stringCadena');
            return ''+vaLor;
        case 'charCadena':
            var vaLor = listaTokens2[posicionLista].Token;
            match('charCadena');
            return ''+vaLor;
        case 'true':
            var vaLor = listaTokens2[posicionLista].Token;
            match('true');
            return ''+vaLor;
        case 'false':
            var vaLor = listaTokens2[posicionLista].Token;
            match('false');
            return ''+vaLor;
        case 'id':
            var vaLor = listaTokens2[posicionLista].Token;
            match('id');
            return ''+vaLor;
        default:
            return false;
    }
}

/**
 * tipos de retornos aceptados en funciones y metodos
 */
function tipoRetorno()
{
    switch(listaTokens2[posicionLista].Tipo)
    {
        case 'void':
            match('void');
            break;
        case 'int':
            match('int');
            break;
        case 'boolean':
            match('boolean');
            break;
        case 'String':
            match('String');
            break;
        case 'char':
            match('char');
            break;
        default:
            return false;
    }
}

