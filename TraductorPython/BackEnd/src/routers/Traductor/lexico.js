class lexico
{
    constructor()
    {
        this.cadena = '';
        this.puntero = 0;
        this.estado = 0;
        this.fila = 1;
        this.columna = 0;
        this.token = '';
        this.caracter = '';
        this.listaTokens = [];
        this.listaTokens2 = [];
        this.listadoErrores = [];
        this.traduccion = [];
        this.palabrasReservadas = ['public','class','main','interface','void','static','int'
        ,'double','char','boolean','true','false','String','for','while','do','if','else','break'
        ,'continue','return','System','out','print','println'];
        //para analisis sintactico
        this.tokenPreanalisis;
        this.valorPreanalisis;
        this.posicionLista=0;
    }


    /**
     * metodo para agregar a sus respectivas listas
     */
    addToken(fila,columna,tipo,token){
        this.listaTokens.push({Fila:fila,Columna:columna,Tipo:tipo,Token:token});
    }

    addToken2(tipo,token)
    {
        this.listaTokens2.push({Tipo:tipo,Token:token});
    }


    addError(tipo,fila,columna,descripcion){
        this.listadoErrores.push({Tipo:tipo,Fila:fila,Columna:columna,Descripcion:descripcion});
    }

    addTraduccion(token){
        this.traduccion.push({Token:token});
    }

    /*
    *metodo de verificacion en codigo ascii
    */
    isLetter(caracter){
        if((caracter >= 65 && caracter <= 90)
        || (caracter >= 97 && caracter <= 122)){
            return true;
        }
        else{
            return false;
        }
    }

    isNumber(caracter){
        if(caracter >= 48 && caracter <= 57){
            return true;
        }
        else{
            return false;
        }
    }

    isSymbol(caracter){
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
    analizador(cadena){
        this.cadena = cadena;
        //console.log(this.cadena);
        //recorrido de toda la cadena
        while(this.puntero<this.cadena.length){
            this.caracter = cadena[this.puntero];
            //
            switch(this.estado){
                //estado de simbolos
                case 0:
                    if(this.isSymbol(this.caracter.charCodeAt(0))){
                        this.addToken(this.fila,this.columna,'Simbolo',this.caracter);
                        this.addToken2(this.caracter,this.caracter);
                        this.columna++;
                    }
                    else if(this.isLetter(this.caracter.charCodeAt(0))
                    ||this.caracter.charCodeAt(0)==95){//_
                        this.token += this.caracter;
                        this.estado = 1;
                    }
                    else if(this.isNumber(this.caracter.charCodeAt(0))){
                        this.token += this.caracter;
                        this.estado = 2;
                    }
                    else if(this.caracter.charCodeAt(0)==34){//""
                        this.token += this.caracter;
                        this.estado = 5;
                    }
                    else if(this.caracter.charCodeAt(0)==39){//'
                        this.token += this.caracter;
                        this.estado = 8;
                    }
                    else if(this.caracter.charCodeAt(0)==47)// /
                    {
                        this.token += this.caracter;
                        this.estado = 11;
                        //console.log(token);
                    }
                    else if(this.caracter=='\t' || this.caracter==' '){//espacios varios
                        //console.log('epsacio');
                        this.columna++;
                    }
                    else if(this.caracter=='\n'){//espacios varios
                        this.fila++;
                        this.columna=0;
                    }
                    else{
                        this.addError('lexico',this.fila,this.columna,'El caracter '+this.caracter+' no pertenece al lenguaje');
                        this.columna++;
                    }
                    break;
                //
                case 1:
                    if(this.isLetter(this.caracter.charCodeAt(0))
                    ||this.isNumber(this.caracter.charCodeAt(0))
                    ||this.caracter.charCodeAt(0)==95){                    
                        this.token += this.caracter; 
                        this.estado = 1;       
                    }
                    else{
                        if(this.palabrasReservadas.includes(this.token)){
                            this.addToken(this.fila,this.columna,'reservada',this.token);
                            this.addToken2(this.token,this.token);
                        }else{
                            this.addToken(this.fila,this.columna,'ID',this.token);
                            this.addToken2('id',this.token);
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
                    if(this.isNumber(this.caracter.charCodeAt(0))){
                        this.token += this.caracter;
                    }
                    else if(this.caracter.charCodeAt(0)==46){
                        this.token += this.caracter;
                        this.estado = 3;
                    }
                    else{
                        this.addToken(this.fila,this.columna,'Digito',this.token);
                        this.addToken2('digito',this.token);
                        this.token='';
                        this.columna++;
                        this.estado=0;
                        this.puntero--;
                    }
                    break;
                //
                case 3:
                    if(this.isNumber(this.caracter.charCodeAt(0))){
                        this.token += this.caracter;
                        this.estado=4;
                    }
                    else{
                        this.addError('lexico',this.fila,this.columna,'El caracter '+this.token+' no pertenece al lenguaje');
                        this.token='';
                        this.columna++;
                        this.estado=0;
                        this.puntero--;
                    }
                    break;
                //
                case 4:
                    if(this.isNumber(this.caracter.charCodeAt(0))){
                        this.token += this.caracter;
                    }
                    else{
                        this.addToken(this.fila,this.columna,'Decimal',this.token);
                        this.addToken2('decimal',this.token);
                        this.token='';
                        this.columna++;
                        this.estado=0;
                        this.puntero--;
                    }
                    break;
                //String
                case 5:
                    if(this.caracter.charCodeAt(0)==34){//""
                        this.token += this.caracter;
                        this.estado =  7;
                    }
                    else if(this.caracter == '\n'){
                        this.addError('lexico',this.fila,this.columna,'El caracter '+this.token+' no pertenece al lenguaje');
                        this.token = '';
                        this.columna++;
                        this.estado=0;
                        this.puntero--;
                    }
                    else{
                        this.token += this.caracter;
                        this.estado = 6;
                    }
                    break;
                //
                case 6:
                    if(this.caracter.charCodeAt(0)==34){//""
                        this.token += this.caracter;
                        this.estado = 7;
                    }
                    else if(this.caracter == '\n'){
                        this.addError('lexico',this.fila,this.columna,'El caracter '+this.token+' no pertenece al lenguaje');
                        this.token = '';
                        this.columna++;
                        this.estado=0;
                        this.puntero--;
                    }
                    else{
                        this.token += this.caracter;
                    }
                    break;
                //
                case 7:
                    this.addToken(this.fila,this.columna,'string',this.token);
                    this.addToken2('stringCadena',this.token);
                    this.token='';
                    this.columna++;
                    this.estado=0;
                    this.puntero--;
                    break;
                //
                case 8:
                    if(this.caracter.charCodeAt(0)==39){//'
                        this.token += this.caracter;
                        this.estado = 10;
                    }
                    else if(this.caracter == '\n')
                    {
                        this.addError('lexico',this.fila,this.columna,'El caracter '+this.token+' no pertenece al lenguaje');
                        this.token = '';
                        this.columna++;
                        this.estado=0;
                        this.puntero--;
                    }
                    else
                    {
                        this.token += this.caracter;
                        this.estado = 9;
                    }
                    break;
                //
                case 9:
                    if(this.caracter.charCodeAt(0)==39){//'
                        this.token += this.caracter;
                        this.estado = 10;
                    }
                    else if(this.caracter == '\n')
                    {
                        this.addError('lexico',this.fila,this.columna,'El caracter '+this.token+' no pertenece al lenguaje');
                        this.token = '';
                        this.columna++;
                        this.estado=0;
                        this.puntero--;
                    }
                    else
                    {
                        this.token += this.caracter;
                    }
                    break;
                //
                case 10:
                    this.addToken(this.fila,this.columna,'Char',this.token);
                    this.addToken2('charCadena',this.token);
                    this.token='';
                    this.columna++;
                    this.estado=0;
                    this.puntero--;
                    break;
                //
                case 11:
                    if(this.caracter.charCodeAt(0)==47){// /
                        this.token += this.caracter;
                        this.estado = 12;
                        //console.log(token);
                    }
                    else if(this.caracter.charCodeAt(0)==42)//*
                    {
                        this.token += this.caracter;
                        this.estado = 13;
                    }
                    else
                    {
                        this.addToken(this.fila,this.columna,'Simbolo',this.token);
                        this.addToken2(this.token,this.token);
                        this.token='';
                        this.columna++;
                        this.estado=0;
                        this.puntero--;
                    }
                    break;
                //
                case 12:
                    if(this.caracter != '\n')
                    {
                        this.token += this.caracter;
                    }
                    else
                    {
                        this.addToken(this.fila,this.columna,'Comentario','Comentario');
                        this.token='';
                        this.columna++;
                        this.estado=0;
                        this.puntero--;
                    }
                    break;
                //
                case 13:
                    if(this.caracter.charCodeAt(0)!=42)//*
                    {
                        this.token += this.caracter;
                    }
                    else
                    {
                        this.token += this.caracter;
                        this.estado = 14;
                    }
                    break;
                //
                case 14:
                    if(this.caracter.charCodeAt(0)==47)// /
                    {
                        this.token += this.caracter;
                        this.addToken(this.fila,this.columna,'Comentario','Comentario');
                        this.token='';
                        this.columna++;
                        this.estado=0;
                    }
                    else if(this.caracter.charCodeAt(0)==42)//*
                    {
                        this.token += this.caracter;
                    }
                    else 
                    {
                        this.token += this.caracter;
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
        this.addToken2('UltimoToken','');  
        //console.log(listaTokens);  
        return [this.listaTokens,this.listaTokens2,this.listadoErrores] 
    }    
    
}


module.exports = lexico;