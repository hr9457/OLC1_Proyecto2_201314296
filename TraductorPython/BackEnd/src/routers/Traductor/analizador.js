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
                        addToken(fila,columna,'Reservada',token);
                        addToken2(token,caracter);
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
                addToken(fila,columna,'String',token);
                addToken2('string',token);
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
                addToken2('char',token);
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
    /*
    *llamada al analisis sintactico
    */
    tokenPreanalisis = listaTokens2[0].Tipo;
    valorPreanalisis = listaTokens2[0].Token;
    console.log(tokenPreanalisis);
    analisisSintactico();// 
    console.log(listaTokens);  
    this.puntero=0;
}


/**
 * metodo de parea
 */
function matchToken(token)
{
    if(token != tokenPreanalisis)
    {
        console.log("Se esperaba: "+token);
        error();//(estado1)
    }
    else
    {
        console.log("match con: "+tokenPreanalisis);
        if(posicionLista<listaTokens2.length)
        {    
            posicionLista++;
            tokenPreanalisis = listaTokens2[posicionLista].Tipo;
        }
    }    
}

/**
 * segundo metodo match
 */
function match(token)
{
    if(token!=tokenPreanalisis)
    {return false;}
    else
    {
        token = tokenPreanalisis;
        console.log("Token: "+token+" hizo match con: "+tokenPreanalisis);
        posicionLista++;
        tokenPreanalisis = listaTokens2[posicionLista].Tipo;
        valorPreanalisis = listaTokens2[posicionLista].Token;
        return true;
    }
}


/**
 * estado de error
 */
function error()
{
    //RECUPERACION ERROR
    while(tokenPreanalisis!='}')
    {
        posicionLista++;
        tokenPreanalisis = listaTokens2[posicionLista].Tipo;
    }
}


/*
*analisis sintactico
*/
function analisisSintactico()
{
    console.log("inicio sintactico");
    java2();
}

function java2()
{
    switch(listaTokens2[posicionLista].Tipo)
    {
        case 'public':
            match('public');
            clase_interface2();
            break;
        default:
            return false;
    }
    java2();
}

//distinguir etre una clase y una interface
function clase_interface2()
{
    switch(listaTokens2[posicionLista].Tipo)
    {
        case 'class':
            if(match('class')==false){break;}
            var id = valorPreanalisis;
            if(match('id')==false){break;}
            if(match('{')==false){break;}
            if(match('}')==false){break;}
            console.log("class "+id+":");
            break;
        case 'interface':
            if(match('interface')==false){break;}
            if(match('id')==false){break;}
            if(match('{')==false){break;}
            if(match('}')==false){break;}
            break;
        default:
            return false;
    }
}

function instruccionesClase(){}
function instruccionesInterface(){}