// IMPORTACIONES
// CODIGO EN JS 
%{
    console.log("*************************UTILIDADES*******************************")
    var listaReporteToken = []
    var listaErroresLexicos = []
    var listaErroresSintacticos = []
    var listaTraducccion = []
    var json;
    /* metodo para agregar y hacer el reporte de tokens reconocidos */
    function addListaToken(fila,columna,tipo,token){
        listaReporteToken.push({Fila:fila,Columna:columna,Tipo:tipo,Token:token});
    }
    /* metodo para guardar todos los errores lexico */
    function addErrorLexico(tipo,fila,columna,descripcion){
        listaErroresLexicos.push({Tipo:tipo,Fila:fila,Columna:columna,Descripcion:descripcion});
    }

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

//--------------------------------------------  comentario unilinea
\/\/.*     {}


//---------------------------------------------- comentario multilinea
\/\*(\*(?!\/)|[^*])*\*\/    {}

//*********************************************
// PALABRAS RESEREVADAS POR EL LENGUAJE JAVA 25
"public"    {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_public';}
"class"     {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'TK_class';}
"main"      {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_main'}
"interface" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_interface';}
"void"      {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_void';}
"static"    {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_static';}
"int"       {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_int';}
"double"    {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_double';}
"char"      {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_char';}
"boolean"   {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_boolean';}
"true"      {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_true';}
"false"     {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_false';}
"String"    {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_String';}
"for"       {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_for';}
"while"     {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_while';}
"do"        {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_do';}
"if"        {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_if';}
"else"      {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_else';}
"break"     {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_break';}
"continue"  {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_continue';}
"return"    {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_return';}
"System"    {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_System';}
"out"       {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_out';}
"print"     {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_print';}
"println"   {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"RESERVADA",""+yytext);return 'Tk_println';}


//**********************************************
// SIMBOLOS  RECONOCIDOS POR EL LENGUAJE JAVA 20
"{" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '{';}
"}" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '}';}
"(" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '(';}
")" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return ')';}
"[" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '[';}
"]" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return ']';}
"," {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return ',';}
"." {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '.';}
";" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return ';';}
"<" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '<';}
">" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '>';}
"&" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '&';}
"|" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '|';}
"!" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '!';}
"^" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '^';}
"=" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '=';}
"+" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '+';}
"-" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '-';}
"*" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '*';}
"/" {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"SIMBOLO",""+yytext);return '/';}



//-------------------------------------------- aceptacion de string
\".*\"                {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"STRING",""+yytext);return 'Tk_cadena';}

//------------------------------------------- acpetacion de char
\'.*\'                {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"CARACTER",""+yytext);return 'Tk_cadenaChar';}

//------------------------------------------- aceptacion de numeros decimales
[0-9]+(.[0-9])+\b     {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"DECIMAL",""+yytext);return 'Tk_decimal';}

//------------------------------------------- aceptacion de digitos de 0 a 9
[0-9]+\b              {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"DIGITO",""+yytext);return 'Tk_digito';}

//  secuencia para aceptar un identificador letras,numero y _ inicio o en medio
[a-zA-Z_][a-zA-Z0-9_]*  {addListaToken(""+yylloc.first_line,""+yylloc.first_column,"IDENTIFICADOR",""+yytext);return 'Tk_identificador';}

// captura para erroles lexico , cualquier caracter, excepto los que ya definimos
.   {addErrorLexico("Lexico",yylloc.first_line,yylloc.first_column,"El caracter "+yytext+" no pertenece al lenguaje");}



//**********************
//  FINAL DEL ARCHIVO
<<EOF>> {return 'EOF';}


/lex 
// FIN DEL BLOQUE DEL ANALISIS LEXICO 


//**************************************************************************
// PRIORIADES CUANDO HAY RECURVIDAD IZQUIER Y DERECHA
// LOGICOS 
%left '&' '|'  '^'
// RELACIONALES
%left '>' '<' '='
// ARITMETICOS
%left '+' '-'
// mayor prioridad
%left '*' '/'
//not
%left '!'
// presedencia explicita
%left NEGATIVOS 


//--------------------------------------------------------------
//  BLOQUE DE ANALISIS SINTACTICO
%start INICIO
%%

// PRODUCCION DE VARIABLES CON LA SUBIDA DE VALORES DE ABAJO HACIA ARRIBA DEL ARBOL
// SUDIBA DE VALORES SOLO DE VARIBLES UNICAS: String var; o String var="hola";
// FALTA LA SUBIDA DE VALORES DE LA DECLARACION MULTIPLE

//**************************************** DONDE ARRANCA LA GRAMATICA ********************************************
INICIO: 
EOF             {return 'Archivo Vacio';}
| JAVA  EOF     {console.log($1);}
;
//console.log(JSON.stringify(listaReporteToken));


//*****************************************************************************************************************
//*********************** GRAMATICA DE JAVA todo lo aceptado en el orden de java **********************************
JAVA:
CLASE               { $$=`${$1}`; }
|INTERFACE          { $$=``; }
|JAVA CLASE         { $$=`${$1}\n${$2}`; }
|JAVA INTERFACE     { $$=`${$1}`; }
;



//*************************** CLASES QUE PUEDEN EXISTIR EN JAVA PUEDE IR DE TODO **********************************
CLASE:
ESTRUCTURA-CLASE        { $$=`${$1}`; }
;


//*********************************** INTERFACES ACEPTADAS EN JAVA *************************************************
INTERFACE:
ESTRUCTURA-INTERFACE    {}
;


//**************** ESTRUCTURAS PERMITIAS DENTRO DE UNA CLASE DE JAVA ************************************************
ESTRUCTURA-CLASE:
'Tk_public' 'TK_class' 'Tk_identificador' '{' '}'                           { $$ = `${$1} ${$2} ${$3} ${$4} \n${$5}`; }
|'Tk_public' 'TK_class' 'Tk_identificador' '{'  INSTRUCCIONES-CLASE  '}'    { $$ = `${$1} ${$2} ${$3} ${$4} \n${$5} \n${$6}`; }
| error '}'                                                                 {}
;


//******************* ESTRUCTURA PERMITIDA DENTRO DE UNA INTERFACE DE JAVA *******************************************
ESTRUCTURA-INTERFACE:
'Tk_public' 'Tk_interface' 'Tk_identificador' '{' '}'                                    {}
|'Tk_public' 'Tk_interface' 'Tk_identificador' '{' INSTRUCCIONES-INTERFACE '}'           {}
;


// METODO MAIN DE JAVA
// METODO MAIN DE JAVA
METODO-MAIN:
'Tk_public' 'Tk_static' 'Tk_void' 'Tk_main' '(' 'Tk_String' '[' ']' 'Tk_identificador' ')' '{' '}'                          { $$=`function main ${$5} ${$9} ${$10} ${$11} \n${$12}`; }
|'Tk_public' 'Tk_static' 'Tk_void' 'Tk_main' '(' 'Tk_String' '[' ']' 'Tk_identificador' ')' '{' INSTRUCCIONES-MAIN '}'      { $$=`function main ${$5} ${$9} ${$10} ${$11} \n${$12} ${$13}`; }
;


//*************************************** METODOS ACEPTADOS EN JAVA ************************************************************************
METODO:
'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' '{' '}'                                     { $$=`function ${$3} ${$4} ${$5} ${$6} ${$7}`; }
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' '{'  '}'                        { $$=`function ${$3} ${$4} ${$5} ${$6} ${$7} \n${$8}`; }
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '('  ')' '{' INSTRUCCIONES-METODO  '}'             { $$=`function ${$3} ${$4} ${$5} ${$6} \n${$7} \n${$8}`; }
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' '{' INSTRUCCIONES-METODO  '}'   { $$=`function ${$3} ${$4} ${$5} ${$6} ${$7} \n${$8} \n${$9}`; }
;


//*************************************** FUNCIONES ACEPTDAS EN JAVA ***************************************
FUNCION:
'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' ';'                 {}
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' ';'     {}
;


//***************** TIPO DE RETORNOS PARA FUNCIONES Y METODOS ***************************
TIPO-RETORNO:
Tk_void         {}
|Tk_int         {}
|Tk_boolean     {}
|Tk_double      {}
|Tk_String      {}
|Tk_char        {}
;

//*************** ESTRUTURA DE LOS PARAMETROS QUE PUEDE RECIBIER UN METODO Y FUNCIONES *************
PARAMETROS:
TIPO-VARIABLE Tk_identificador                  { $$=`${$2}`; }
|PARAMETROS ',' TIPO-VARIABLE Tk_identificador  { $$=`${$1}${$2}${$4}`; }
;


//******************INSTRUCCIONES ACEPTADAS DENTRO DE UNA CLASE********************
INSTRUCCIONES-CLASE:
VARIABLE                            { $$=`${$1}`; }
|ASIGNACION-A                       { $$=`${$1}`; }
|METODO                             { $$=`${$1}`; }
|METODO-MAIN                        { $$=`${$1}`; }
|FUNCION                            { $$=`${$1}`; }
|INSTRUCCIONES-CLASE METODO         { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CLASE FUNCION        { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CLASE VARIABLE       { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CLASE ASIGNACION-A   { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CLASE METODO-MAIN    { $$=`${$1}\n${$2}`; }
;


// INSTRUCCIONES ACEPTADAS DENTRO DE UN METODO MAIN
INSTRUCCIONES-MAIN:
VARIABLE                                { $$=`${$1}`; }
|ASIGNACION-A                           { $$=`${$1}`; }
|LLAMADA-METODO                         {             }
|FUNCION-IF                             { $$=`${$1}`; }
|FUNCION-FOR                            { $$=`${$1}`; }
|FUNCION-WHILE                          { $$=`${$1}`; }
|FUNCION-DOWHILE                        { $$=`${$1}`; }
|IMPRESION                              { $$=`${$1}`; }
|IMPRESION-SALTO                        { $$=`${$1}`; }
|RETORNO                                { $$=`${$1}`; }
|INSTRUCCIONES-MAIN VARIABLE            { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-MAIN ASIGNACION-A        { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-MAIN LLAMADA-METODO      { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-MAIN FUNCION-IF          { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-MAIN FUNCION-FOR         { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-MAIN FUNCION-WHILE       { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-MAIN FUNCION-DOWHILE     { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-MAIN IMPRESION           { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-MAIN IMPRESION-SALTO     { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-MAIN RETORNO             { $$=`${$1}\n${$2}`; }
;


//**************************** INSTRUCCIONES QUE PUEDE RECIBIR UNA INTERFACE EN JAVA ***********************************
INSTRUCCIONES-INTERFACE:
'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' ';'                                         {}
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' ';'                             {}
|INSTRUCCIONES-INTERFACE 'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' ';'                {}
|INSTRUCCIONES-INTERFACE 'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' ';'     {}
| error ';'                                                                                     {}
;


//********************* todas las instrucciones aceptadas dentro de los metodos *****************************************
INSTRUCCIONES-METODO:
VARIABLE                                            { $$=`${$1}`; }
|ASIGNACION-A                                       { $$=`${$1}`; }
|FUNCION-IF                                         { $$=`${$1}`; }
|FUNCION-FOR                                        { $$=`${$1}`; }
|FUNCION-WHILE                                      { $$=`${$1}`; }
|FUNCION-DOWHILE                                    { $$=`${$1}`; }
|LLAMADA-METODO                                     { $$=`${$1}`; }
|IMPRESION                                          { $$=`${$1}`; }
|IMPRESION-SALTO                                    { $$=`${$1}`; }
|RETORNO                                            { $$=`${$1}`; }
|Tk_identificador '+' '+' ';'                       { $$=`${$1}${$2}${$3}${$4}`; }
|INSTRUCCIONES-METODO VARIABLE                      { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-METODO ASIGNACION-A                  { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-METODO FUNCION-IF                    { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-METODO FUNCION-FOR                   { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-METODO FUNCION-WHILE                 { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-METODO FUNCION-DOWHILE               { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-METODO LLAMADA-METODO                { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-METODO IMPRESION                     { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-METODO IMPRESION-SALTO               { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-METODO RETORNO                       { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-METODO Tk_identificador '+' '+' ';'  { $$=`${$1}\n${$2}${$3}${$4}${$5}`; }
;


// ASIGNACIONACIONES A UNA VARIABLE DECLARADAS
//********************* ASIGNACION A VARIABLES YA DECLARADAS ********************
ASIGNACION-A:
Tk_identificador '=' EXPRESION ';' { $$=`${$1} ${$2} ${$3}${$4}`; }
;


//********************** ESTRUCTURA DE UNA VARIABLE ******************************
VARIABLE:
TIPO-VARIABLE DECLARACION ';' { $$=`${$1} ${$2} ${$3}`; }
| error ';'                   { $$=``; }
;


//******************* TIPO DE VARIABLES ACEPTADAS EN JAVA **************************
TIPO-VARIABLE:
Tk_int      { $$="var"; }
|Tk_boolean { $$="var"; }
|Tk_double  { $$="var"; }
|Tk_String  { $$="var"; }
|Tk_char    { $$="var"; }
;


//******************* DECLARACION DE UNA O VARIAS VARIABLES ***************************
DECLARACION:
ASIGNACION                      { $$= `${$1}`; }
| DECLARACION ',' ASIGNACION    { $$ =`${$1}${$2}${$3}`; }
;


//***************** TIPOS DE ASIGNACION QUE SE LE PUEDE HACER A UNA VARIABLE ***********
ASIGNACION:
Tk_identificador '=' EXPRESION  { $$=`${$1} ${$2} ${$3}`;}
|Tk_identificador               { $$=`${$1}`; }
;

//***************************** EXPRESIONES POSIBLE EN JAVA ******************************
EXPRESION:
EXPRESION '&' '&' EXPRESION     {$$=`${$1} and ${$4}`;}
|EXPRESION '|' '|' EXPRESION    {$$=`${$1} or ${$4}`;}
|EXPRESION '>' '=' EXPRESION    {$$=`${$1} >= ${$4}`;}
|EXPRESION '<' '=' EXPRESION    {$$=`${$1} <= ${$4}`;}
|EXPRESION '=' '=' EXPRESION    {$$=`${$1} == ${$4}`;}
|EXPRESION '!' '=' EXPRESION    {$$=`${$1} != ${$4}`;}
|EXPRESION '+' '+'              {$$=`${$1}++`;}
|EXPRESION '-' '-'              {$$=`${$1}--`;}
|EXPRESION '^' EXPRESION 
|EXPRESION '>' EXPRESION        {$$=`${$1}>${$3}`;}
|EXPRESION '<' EXPRESION        {$$=`${$1}<${$3}`;}
|EXPRESION '*' EXPRESION        {$$=`${$1}*${$3}`;}
|EXPRESION '/' EXPRESION        {$$=`${$1}/${$3}`;}
|EXPRESION '+' EXPRESION        {$$=`${$1}+${$3}`;}
|EXPRESION '-' EXPRESION        {$$=`${$1}-${$3}`;}
|'!' EXPRESION                  {$$=`not ${$2}`;}
|'-' EXPRESION %prec NEGATIVOS  {$$=`-${$2}`;}    
|VALOR                          {$$=`${$1}`;}
;


//********************** VALOR QUE SE LE PUEDE ASIGNAR DENTRO DE JAVA *************************
VALOR:
Tk_digito           {$$=`${$1}`;}
|Tk_decimal         {$$=`${$1}`;}
|Tk_cadena          {$$=`${$1}`;}
|Tk_cadenaChar      {$$=`${$1}`;}
|Tk_true            {$$=`${$1}`;}
|Tk_false           {$$=`${$1}`;}
|Tk_identificador   {$$=`${$1}`;}
;



//********************************** FUNCION IF PARA JAVA ************************************
FUNCION-IF:
IF         { $$=`${$1}`; }
|IF ELSE   { $$=`${$1}\n${$2}`; }
;

//****************************** puede venir un if  o un else if varias veces
IF:
Tk_if '(' EXPRESION   ')' '{'   INSTRUCCIONES-CICLOS   '}'                  { $$=`${$1}${$2} ${$3} ${$4}${$5} \n${$6} \n${$7}`; }
|Tk_if '(' EXPRESION ')' '{'   '}'                                          { $$=`${$1}${$2} ${$3} ${$4}${$5}${$6}`; }
| IF 'Tk_else' Tk_if '('  EXPRESION   ')' '{'  INSTRUCCIONES-CICLOS  '}'    { $$=`${$1} \n${$2} ${$3}${$4} ${$5} ${$6}${$7} \n${$8} \n${$9}`; }
| IF 'Tk_else' Tk_if '(' EXPRESION ')' '{'   '}'                            { $$=`${$1} \n${$2} ${$3}${$4} ${$5} ${$6}${$7}${$8}`; }
;



//******************************* ELSE PUEDE O NO PUEDE VENIR
ELSE:
Tk_else '{'  INSTRUCCIONES-CICLOS '}'   { $$=`${$1}${$2} \n${$3} \n${$4}`; }
|Tk_else '{'    '}'                     { $$=`${$1}${$2}${$3}`; }
;




//**************************** estructura de la funcion for aceptada en java *********************************************
FUNCION-FOR:
Tk_for '(' DEC ';' EXPRESION ';' EXPRESION ')' '{'  INSTRUCCIONES-CICLOS  '}'   { $$=`${$1}${$2} ${$3}${$4}${$5}${$6}${$7} ${$8}${$9} \n${$10} \n${$11}`;}
|Tk_for '(' DEC ';' EXPRESION ';' EXPRESION ')' '{' '}'                         { $$=`${$1}${$2} ${$3}${$4}${$5}${$6}${$7} ${$8}${$9}${$10}`;}
;


//********** estrutura de dec que puede tener un for va dentro del for **************************************************** 
DEC:
TIPO-VARIABLE Tk_identificador '=' VALOR    { $$=`${$1}${$2}${$3}`; }
|Tk_identificador '=' VALOR                 { $$=`${$1}${$2}${$3}`; }
|Tk_identificador                           { $$=`${$1}`; }
;


//*************************************************** estructura de un while ************************************************
FUNCION-WHILE:
Tk_while '(' EXPRESION ')' '{'  INSTRUCCIONES-CICLOS  '}'   { $$=`${$1}${$2} ${$3} ${$4}${$5} \n${$6} \n${$7}`; }
|Tk_while '(' EXPRESION ')' '{'  '}'                        { $$=`${$1}${$2} ${$3} ${$4}${$5}${$6}`; }
;


// estructura de de un do while en java
FUNCION-DOWHILE:
Tk_do '{'  INSTRUCCIONES-CICLOS  '}' Tk_while '(' EXPRESION ')' ';'     { $$=`${$1}${$2} \n${$3} \n${$4}${$5}${$6} ${$7} ${$8}${$9}`; }
|Tk_do '{'  '}' Tk_while '(' EXPRESION ')' ';'                          { $$=`${$1}${$2}${$3}${$4}${$5} ${$6} ${$7}${$8}`; }
;



// bloque de sentencias que pueden venir dentro de un if
INSTRUCCIONES-CICLOS:
VARIABLE                                            { $$=`${$1}`; }
|ASIGNACION-A                                       { $$=`${$1}`; }
|FUNCION-IF                                         { $$=`${$1}`; }
|FUNCION-FOR                                        { $$=`${$1}`; }
|FUNCION-WHILE                                      { $$=`${$1}`; }
|FUNCION-DOWHILE                                    { $$=`${$1}`; }
|LLAMADA-METODO                                     { $$=`${$1}`; }
|IMPRESION                                          { $$=`${$1}`; }
|IMPRESION-SALTO                                    { $$=`${$1}`; }
|RETORNO                                            { $$=`${$1}`; }
|Tk_identificador '+' '+' ';'                       { $$=`${$1}${$2}${$3}${$4}`; }
|INSTRUCCIONES-CICLOS FUNCION-IF                    { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CICLOS FUNCION-FOR                   { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CICLOS FUNCION-WHILE                 { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CICLOS FUNCION-DOWHILE               { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CICLOS LLAMADA-METODO                { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CICLOS IMPRESION                     { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CICLOS IMPRESION-SALTO               { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CICLOS RETORNO                       { $$=`${$1}\n${$2}`; }
|INSTRUCCIONES-CICLOS Tk_identificador '+' '+' ';'  { $$=`${$1}\n${$2}${$3}${$4}${$5}`; }
;




// estructura de una llamda a metodo
LLAMADA-METODO:
Tk_identificador '(' ')' ';'                            { $$=`${$1}${$2}${$3}${$4}`; }
|Tk_identificador '('  PARAMETROSEN-LLAMADA ')' ';'     { $$=`${$1}${$2} ${$3} ${$4}${$5}`; }
;


//*********************  parametros para llamadas a metodos *******************************************
PARAMETROSEN-LLAMADA:
EXPRESION                              { $$=`${$1}`; }
|PARAMETROSEN-LLAMADA ',' EXPRESION    { $$=`${$1}${$2}${$3}`; }
;


// tipos de retornos que pueden existir dentro de java
RETORNO:
Tk_break ';'                { $$=`${$1}${$2}`; }
|Tk_continue ';'            { $$=`${$1}${$2}`; }
|Tk_return ';'              { $$=`${$1}${$2}`; }
|Tk_return EXPRESION ';'    { $$=`${$1} ${$2}${$3}`; }
;


//****************************** impresiones que se pueden realizar dentro java **********************************
IMPRESION:
Tk_System '.' Tk_out '.' 'Tk_print' '('   ')'  ';'                      { $$=`console.log()${$8}`; }
|Tk_System '.' Tk_out '.' 'Tk_print' '('  EXPRESION  ')'  ';'           { $$=`console.log( ${$7} )${$9}`; }
;


IMPRESION-SALTO:
Tk_System '.' Tk_out '.' 'Tk_println' '('  ')'  ';'                     { $$=`console.log()${$8}`; }
|Tk_System '.' Tk_out '.' 'Tk_println' '('  EXPRESION  ')'  ';'         { $$=`console.log( ${$7} )${$9}`; }
;


ERROR:
error {console.log('error Sintactico:  '+yytext+'  fila: '+ this._$.first_line );}
;