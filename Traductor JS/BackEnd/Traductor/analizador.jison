// IMPORTACIONES
// CODIGO EN JS 
%{
    console.log("*************************UTILIDADES*******************************")
    var listaReporteToken = []
    var listaErroresLexicos = []
    var listaErroresSintacticos = []
    var listaTraducccion = []
%}

//------------------------------------------------------------------------------------------------
// BLOQUE DE ANALISIS LEXICO

%lex 

//  ANALIZADOR SE SENSIBLE
%options case-sensitive


// MARCADAO DE INICIO - TODO LO NECESARIO EN EL ANALIZADOR LEXICO
%%


// EXPRESIONES REGULARES  PARA ACEPTACION DE CADENAS ESPECIALES POR EL LENGUAJE JAVA 6


// espacios, tabulaciones, nuevas lines
\s+  {}


// aceptacion de numeros decimales
[0-9]+.[0-9]+\b    {return 'Tk_decimal';}

// aceptacion de digitos de 0 a 9
[0-9]+\b {return 'Tk_digito';}


// aceptacion de string
\".*\"   {return 'Tk_cadena';}

// acpetacion de char
\'.*\'    {return 'Tk_cadenaChar';}

//  comentario unilinea
\/\/.*  {}


// comentario multilinea
\/\*(\*(?!\/)|[^*])*\*\/    {}



//*********************************************
// PALABRAS RESEREVADAS POR EL LENGUAJE JAVA 25
"public"    {return 'Tk_public';}
"class"     {return 'TK_class';}
"main"      {return 'Tk_main'}
"interface" {return 'Tk_interface';}
"void"      {return 'Tk_void';}
"static"    {return 'Tk_static';}
"int"       {return 'Tk_int';}
"double"    {return 'Tk_double';}
"char"      {return 'Tk_char';}
"boolean"   {return 'Tk_boolean';}
"true"      {return 'Tk_true';}
"false"     {return 'Tk_false';}
"String"    {return 'Tk_String';}
"for"       {return 'Tk_for';}
"while"     {return 'Tk_while';}
"do"        {return 'Tk_do';}
"if"        {return 'Tk_if';}
"else"      {return 'Tk_else';}
"break"     {return 'Tk_break';}
"continue"  {return 'Tk_continue';}
"return"    {return 'Tk_return';}
"System"    {return 'Tk_System';}
"out"       {return 'Tk_out';}
"print"     {return 'Tk_print';}
"println"   {return 'Tk_println';}


//**********************************************
// SIMBOLOS  RECONOCIDOS POR EL LENGUAJE JAVA 20
"{" {return '{';}
"}" {return '}';}
"(" {return '(';}
")" {return ')';}
"[" {return '[';}
"]" {return ']';}
"," {return ',';}
"." {return '.';}
";" {return ';';}
"<" {return '<';}
">" {return '>';}
"&" {return '&';}
"|" {return '|';}
"!" {return '!';}
"^" {return '^';}
"=" {return '=';}
"+" {return '+';}
"-" {return '-';}
"*" {return '*';}
"/" {return '/';}


//  secuencia para aceptar un identificador letras,numero y _ inicio o en medio
[a-zA-Z_][a-zA-Z0-9_]*  {return 'Tk_identificador';}




// captura para erroles lexico , cualquier caracter, excepto los que ya definimos
.   {console.log('ERROR LEXICO:  '+yytext);
listaErroresLexicos.push(["Tipo: "+yytext,"Fila: "+yylloc.first_line,
"Columna: "+yylloc.first_column,"Descripcion: El caracter "+yytext+" no pertenece al lenguaje"]);
}



//**********************
//  FINAL DEL ARCHIVO
<<EOF>> {return 'EOF';}


/lex 
// FIN DEL BLOQUE DEL ANALISIS LEXICO 


// PRIORIADES CUANDO HAY RECURVIDAD IZQUIER Y DERECHA
// LOGICOS 
%left '&' '|' '!' '^'
// RELACIONALES
%left '>' '<' '='
// ARITMETICOS
%left '+' '-' '*' '/'
//XOR
%left '^'


//--------------------------------------------------------------
//  BLOQUE DE ANALISIS SINTACTICO
%start INICIO
%%

// PRODUCCION DE VARIABLES CON LA SUBIDA DE VALORES DE ABAJO HACIA ARRIBA DEL ARBOL
// SUDIBA DE VALORES SOLO DE VARIBLES UNICAS: String var; o String var="hola";
// FALTA LA SUBIDA DE VALORES DE LA DECLARACION MULTIPLE

// DONDE ARRANCA LA GRAMATICA
INICIO: 
EOF         {return 'Archivo Vacio';}
| JAVA  EOF {}
| {}
;



// GRAMATICA DE JAVA
JAVA:
CLASE {}
|INTERFACE {}
|JAVA CLASE  {}
|JAVA INTERFACE {}
|ERROR 
;



// CLASES QUE PUEDEN EXISTIR EN JAVA PUEDE IR DE TODO
CLASE:
ESTRUCTURA-CLASE {}
;


// INTERFACES ACEPTADAS EN JAVA
INTERFACE:
ESTRUCTURA-INTERFACE {}
;


// ESTRUCTURAS PERMITIAS DENTRO DE UNA CLASE DE JAVA
ESTRUCTURA-CLASE:
'Tk_public' 'TK_class' 'Tk_identificador' '{' '}' {}
|'Tk_public' 'TK_class' 'Tk_identificador' '{'  INSTRUCCIONES-CLASE  '}' { console.log($1+" "+$2+" "+$3+" "+$4+" "+$6);}
;


// ESTRUCTURA PERMITIDA DENTRO DE UNA INTERFACE DE JAVA
ESTRUCTURA-INTERFACE:
'Tk_public' 'Tk_interface' 'Tk_identificador' '{' '}'
|'Tk_public' 'Tk_interface' 'Tk_identificador' '{' INSTRUCCIONES-INTERFACE '}' 
;


// METODO MAIN DE JAVA
// METODO MAIN DE JAVA
METODO-MAIN:
'Tk_public' 'Tk_static' 'Tk_void' 'Tk_main' '(' 'Tk_String' '[' ']' 'Tk_identificador' ')' '{' '}'  {}
|'Tk_public' 'Tk_static' 'Tk_void' 'Tk_main' '(' 'Tk_String' '[' ']' 'Tk_identificador' ')' '{' INSTRUCCIONES-MAIN '}'  {}
;


// METODOS ACEPTADOS EN JAVA
METODO:
'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' '{' '}'
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' '{'  '}'
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' '{' INSTRUCCIONES-METODO  '}'
;


//FUNCIONES ACEPTDAS EN JAVA
FUNCION:
'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' ';'
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' ';'
;


// TIPO DE RETORNOS PARA FUNCIONES Y METODOS
TIPO-RETORNO:
Tk_void {}
|Tk_int      {}
|Tk_boolean {}
|Tk_double  {}
|Tk_String  {}
|Tk_char    {}
;

// ESTRUTURA DE LOS PARAMETROS QUE PUEDE RECIBIER UN METODO Y FUNCIONES
PARAMETROS:
TIPO-VARIABLE Tk_identificador
|PARAMETROS ',' TIPO-VARIABLE Tk_identificador
;


//INSTRUCCIONES ACEPTADAS DENTRO DE UNA CLASE
INSTRUCCIONES-CLASE:
VARIABLE {}
|ASIGNACION-A {}
|METODO {}
|METODO-MAIN {}
|FUNCION {}
|INSTRUCCIONES-CLASE METODO {}
|INSTRUCCIONES-CLASE FUNCION {}
|INSTRUCCIONES-CLASE VARIABLE {}
|INSTRUCCIONES-CLASE ASIGNACION-A {}
;


// INSTRUCCIONES ACEPTADAS DENTRO DE UN METODO MAIN
INSTRUCCIONES-MAIN:
VARIABLE {}
|ASIGNACION-A {}
|LLAMADA-METODO
|FUNCION-IF {}
|FUNCION-FOR {}
|FUNCION-WHILE {}
|FUNCION-DOWHILE {}
|IMPRESION {}
|IMPRESION-SALTO {}
|RETORNO {}
|INSTRUCCIONES-MAIN VARIABLE {}
|INSTRUCCIONES-MAIN ASIGNACION-A {}
|INSTRUCCIONES-MAIN LLAMADA-METODO {}
|INSTRUCCIONES-MAIN FUNCION-IF {}
|INSTRUCCIONES-MAIN FUNCION-FOR {}
|INSTRUCCIONES-MAIN FUNCION-WHILE  {}
|INSTRUCCIONES-MAIN FUNCION-DOWHILE {}
|INSTRUCCIONES-MAIN IMPRESION  {}
|INSTRUCCIONES-MAIN IMPRESION-SALTO {}
|INSTRUCCIONES-MAIN RETORNO {}
;


// INSTRUCCIONES QUE PUEDE RECIBIR UNA INTERFACE EN JAVA
INSTRUCCIONES-INTERFACE:
'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' ';' {}
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' ';' {}
|INSTRUCCIONES-INTERFACE 'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' ';' {}
|INSTRUCCIONES-INTERFACE 'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' ';' {}
| ERROR ';'
;


// todas las instrucciones aceptadas dentro de los metodos
INSTRUCCIONES-METODO:
VARIABLE {}
|ASIGNACION-A {}
|FUNCION-IF {}
|FUNCION-FOR {}
|FUNCION-WHILE {}
|FUNCION-DOWHILE {}
|LLAMADA-METODO {}
|IMPRESION {}
|IMPRESION-SALTO {}
|RETORNO {}
|INSTRUCCIONES-METODO VARIABLE {}
|INSTRUCCIONES-METODO ASIGNACION-A {}
|INSTRUCCIONES-METODO FUNCION-IF {}
|INSTRUCCIONES-METODO FUNCION-FOR {}
|INSTRUCCIONES-METODO FUNCION-WHILE  {}
|INSTRUCCIONES-METODO FUNCION-DOWHILE {}
|INSTRUCCIONES-METODO LLAMADA-METODO {}
|INSTRUCCIONES-METODO IMPRESION  {}
|INSTRUCCIONES-METODO IMPRESION-SALTO {}
|INSTRUCCIONES-METODO RETORNO {}
;


// ASIGNACIONACIONES A UNA VARIABLE DECLARADAS
// ASIGNACION A VARIABLES YA DECLARADAS
ASIGNACION-A:
Tk_identificador '=' EXPRESION ';' {}
;


// ESTRUCTURA DE UNA VARIABLE
VARIABLE:
TIPO-VARIABLE DECLARACION ';' {console.log($1+" "+$2+" "+$3);}
| ERROR ';'
;


// TIPO DE VARIABLES ACEPTADAS EN JAVA
TIPO-VARIABLE:
Tk_int      {$$="var"}
|Tk_boolean {}
|Tk_double  {}
|Tk_String  {}
|Tk_char    {}
;


// DECLARACION DE UNA O VARIAS VARIABLES
DECLARACION:
ASIGNACION  {}
| DECLARACION ',' ASIGNACION {}
;


// TIPOS DE ASIGNACION QUE SE LE PUEDE HACER A UNA VARIABLE
ASIGNACION:
Tk_identificador '=' EXPRESION  {}
|Tk_identificador           {}
;


EXPRESION:
EXPRESION '&' '&' EXPRESION 
|EXPRESION '|' '|' EXPRESION 
|EXPRESION '>' '=' EXPRESION
|EXPRESION '<' '=' EXPRESION
|EXPRESION '=' '=' EXPRESION
|EXPRESION '!' '=' EXPRESION 
|EXPRESION '!' EXPRESION    
|EXPRESION '^' EXPRESION 
|EXPRESION '>' EXPRESION
|EXPRESION '<' EXPRESION  
|EXPRESION '+' EXPRESION 
|EXPRESION '-' EXPRESION 
|EXPRESION '*' EXPRESION 
|EXPRESION '/' EXPRESION  
|EXPRESION '+' '+'
|EXPRESION '-' '-'
|'-' EXPRESION       
|VALOR {}
|Tk_identificador {}
;


// VALOR QUE SE LE PUEDE ASIGNAR DENTRO DE JAVA
VALOR:
Tk_digito       {}
|Tk_decimal     {}
|Tk_cadena      {}
|Tk_cadenaChar  {}
|Tk_true        {}
|Tk_false       {}
;



// FUNCION IF PARA JAVA
FUNCION-IF:
IF ELSE
;

// puede venir un if  o un else if varias veces
IF:
Tk_if '(' EXPRESION   ')' '{'   INSTRUCCIONES-CICLOS   '}'   {}
|Tk_if '(' EXPRESION ')' '{'   '}'
| IF 'Tk_else' Tk_if '('  EXPRESION   ')' '{'  INSTRUCCIONES-CICLOS  '}'   {}
| IF 'Tk_else' Tk_if '(' EXPRESION ')' '{'   '}'
;



// ELSE PUEDE O NO PUEDE VENIR
ELSE:
Tk_else '{'  INSTRUCCIONES-CICLOS '}' {}
|Tk_else '{'    '}' {}
| {}
;





FUNCION-FOR:
Tk_for '(' DEC ';' EXPRESION ';' EXPRESION ')' '{'  INSTRUCCIONES-CICLOS  '}' {}
|Tk_for '(' DEC ';' EXPRESION ';' EXPRESION ')' '{' '}' {}
;


//estrutura de dec que puede tener un for 
DEC:
VARIABLE {}
|ASIGNACION-A {}
;


//estructura de un while
FUNCION-WHILE:
Tk_while '(' EXPRESION ')' '{'  INSTRUCCIONES-CICLOS  '}'
|Tk_while '(' EXPRESION ')' '{'  '}'
;


// estructura de de un do while en java
FUNCION-DOWHILE:
Tk_do '{'  INSTRUCCIONES-CICLOS  '}' Tk_while '(' EXPRESION ')' ';' {}
|Tk_do '{'  '}' Tk_while '(' EXPRESION ')' ';' {}
;



// bloque de sentencias que pueden venir dentro de un if
INSTRUCCIONES-CICLOS:
FUNCION-IF
|FUNCION-FOR
|FUNCION-WHILE
|FUNCION-DOWHILE
|LLAMADA-METODO
|IMPRESION
|IMPRESION-SALTO
|RETORNO 
|INSTRUCCIONES-CICLOS FUNCION-IF
|INSTRUCCIONES-CICLOS FUNCION-FOR
|INSTRUCCIONES-CICLOS FUNCION-WHILE
|INSTRUCCIONES-CICLOS FUNCION-DOWHILE
|INSTRUCCIONES-CICLOS LLAMADA-METODO
|INSTRUCCIONES-CICLOS IMPRESION
|INSTRUCCIONES-CICLOS IMPRESION-SALTO
|INSTRUCCIONES-CICLOS RETORNO 
;




// estructura de una llamda a metodo
LLAMADA-METODO:
Tk_identificador '(' ')' ';' {}
|Tk_identificador '('  PARAMETROSEN-LLAMADA ')' ';' {}
;


// --parametros para llamadas a metodos--
PARAMETROSEN-LLAMADA:
VARIABLE-DEFINIDA
|VALORDE-ENVIO
|PARAMETROSEN-LLAMADA VARIABLE-DEFINIDA
|PARAMETROSEN-LLAMADA VALORDE-ENVIO
;


// --variables definidas para recibir como parametros dentro de llamdas a Metodos--
VARIABLE-DEFINIDA:
Tk_identificador
;

// valores de envio hacia una llamada a metodo---
VALORDE-ENVIO:
Tk_digito       
|Tk_decimal     
|Tk_cadena      
|Tk_cadenaChar  
|Tk_true        
|Tk_false       
;


// tipos de retornos que pueden existir dentro de java
RETORNO:
Tk_break ';'
|Tk_continue ';'
|Tk_return ';'
|Tk_return EXPRESION ';'
;


// impresiones que se pueden realizar dentro java
IMPRESION:
Tk_System '.' Tk_out '.' 'Tk_print' '('   ')'  ';' {}
|Tk_System '.' Tk_out '.' 'Tk_print' '('  EXPRESION  ')'  ';' {}
;


IMPRESION-SALTO:
Tk_System '.' Tk_out '.' 'Tk_println' '('  ')'  ';' {}
|Tk_System '.' Tk_out '.' 'Tk_println' '('  EXPRESION  ')'  ';' {}
;


ERROR:
error {console.log('error:  '+yytext+'  fila: '+ this._$.first_line );}
;