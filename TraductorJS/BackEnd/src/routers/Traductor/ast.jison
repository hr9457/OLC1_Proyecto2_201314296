// IMPORTACIONES
// CODIGO EN JS 
%{
    console.log("*************************UTILIDADES*******************************")
    var ast = [];
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
\/\/.*                      {}


//---------------------------------------------- comentario multilinea
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



//-------------------------------------------- aceptacion de string
[\"][^\\\"]*([\\][\\\"ntr][^\\\"]*)*[\"]      {return 'Tk_cadena';}

//------------------------------------------- acpetacion de char
[\'][^\\\']*([\\][\\\'ntr][^\\\']*)*[']       {return 'Tk_cadenaChar';}

//------------------------------------------- aceptacion de numeros decimales
[0-9]+("."[0-9]+)?\b            {return 'Tk_decimal';}

//------------------------------------------- aceptacion de digitos de 0 a 9
[0-9]+\b                        {return 'Tk_digito';}

//  secuencia para aceptar un identificador letras,numero y _ inicio o en medio
[a-zA-Z_][a-zA-Z0-9_]*          {return 'Tk_identificador';}





// captura para erroles lexico , cualquier caracter, excepto los que ya definimos
.                       {addErrorLexico("Lexico",yylloc.first_line,yylloc.first_column,"El caracter "+yytext+" no pertenece al lenguaje");}



//**********************
//  FINAL DEL ARCHIVO
<<EOF>>                  {return 'EOF';}


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
EOF             { return 'Archivo Vacio'; }
| JAVA  EOF     { return  {"name": "INCIO", "children":$1} ; }
;


//*****************************************************************************************************************
//*********************** GRAMATICA DE JAVA todo lo aceptado en el orden de java **********************************
JAVA:
CLASE           { $$=[{"name":"CLASE","children":$1}]; }
|INTERFACE      { $$=[{"name":"INTER","children":$1}]; }
|JAVA CLASE     { $$=[{"name":"JAVA","children":$1},{"name":"CLASE","children":$2}];  }
|JAVA INTERFACE { $$=[{"name":"JAVA","children":$1},{"name":"INTER","children":$2}];  }
;



//*************************** CLASES QUE PUEDEN EXISTIR EN JAVA PUEDE IR DE TODO **********************************
CLASE:
ESTRUCTURA-CLASE { $$=$1 }
;


//*********************************** INTERFACES ACEPTADAS EN JAVA *************************************************
INTERFACE:
ESTRUCTURA-INTERFACE { $$=$1 }
;


//**************** ESTRUCTURAS PERMITIAS DENTRO DE UNA CLASE DE JAVA ************************************************
ESTRUCTURA-CLASE:
'Tk_public' 'TK_class' 'Tk_identificador' '{' '}'                           { $$=[{"name":"public"},{"name":"class"},{"name":$3},{"name":"{"},{"name":"}"}]; }
|'Tk_public' 'TK_class' 'Tk_identificador' '{'  INSTRUCCIONES-CLASE  '}'    { $$=[{"name":"public"},{"name":"class"},{"name":$3},{"name":"{"},{"name":"INSTRU","children":$5},{"name":"}"}]; }
| error '}'                                                                 { $$=[]; }
;


//******************* ESTRUCTURA PERMITIDA DENTRO DE UNA INTERFACE DE JAVA *******************************************
ESTRUCTURA-INTERFACE:
'Tk_public' 'Tk_interface' 'Tk_identificador' '{' '}'                               {  $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5}]; }
|'Tk_public' 'Tk_interface' 'Tk_identificador' '{' INSTRUCCIONES-INTERFACE '}'      {  $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":"INST","children":$5},{"name":$6}]; }
;


// METODO MAIN DE JAVA
// METODO MAIN DE JAVA
METODO-MAIN:
'Tk_public' 'Tk_static' 'Tk_void' 'Tk_main' '(' 'Tk_String' '[' ']' 'Tk_identificador' ')' '{' '}'                      { $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":"("},{"name":$6},{"name":"["},{"name":"]"},{"name":$9},{"name":"{"},{"name":"}"}]; }
|'Tk_public' 'Tk_static' 'Tk_void' 'Tk_main' '(' 'Tk_String' '[' ']' 'Tk_identificador' ')' '{' INSTRUCCIONES-MAIN '}'  { $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":"("},{"name":$6},{"name":"["},{"name":"]"},{"name":$9},{"name":"{"},{"name":"INST","children":$12},{"name":"}"}];   }
|error '}' {$$=[];}
;


//*************************************** METODOS ACEPTADOS EN JAVA ************************************************************************
METODO:
'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' '{' '}'                                     {  $$=[{"name":"public"},{"name":"TIPO","children":$2},{"name":$3},{"name":"("},{"name":")"},{"name":"{"},{"name":"}"}];  }
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' '{'  '}'                        {  $$=[{"name":"public"},{"name":"TIPO","children":$2},{"name":$3},{"name":"("},{"name":"PARAM","children":$5},{"name":")"},{"name":"{"},{"name":"}"}];  }
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '('  ')' '{' INSTRUCCIONES-METODO  '}'             {  $$=[{"name":"public"},{"name":"TIPO","children":$2},{"name":$3},{"name":"("},{"name":")"},{"name":"{"},{"name":"INSTR","children":$7},{"name":"}"}];  }
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' '{' INSTRUCCIONES-METODO  '}'   {  $$=[{"name":"public"},{"name":"TIPO","children":$2},{"name":$3},{"name":"("},{"name":"PARAM","children":$5},{"name":")"},{"name":"{"},{"name":"INSTR","children":$8},{"name":"}"}];  }
;


//*************************************** FUNCIONES ACEPTDAS EN JAVA ***************************************
FUNCION:
'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' ';'                 { $$=[{"name":$1},{"name":"TIPO","children":$2},{"name":$3},{"name":$4},{"name":$5},{"name":$6}]; }
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' ';'     { $$=[{"name":$1},{"name":"TIPO","children":$2},{"name":$3},{"name":$4},{"name":"PARAM","children":$5},{"name":$6},{"name":$7}]; }
;


//***************** TIPO DE RETORNOS PARA FUNCIONES Y METODOS ***************************
TIPO-RETORNO:
Tk_void         { $$=[{"name":$1}]; }
|Tk_int         { $$=[{"name":$1}]; }
|Tk_boolean     { $$=[{"name":$1}]; }
|Tk_double      { $$=[{"name":$1}]; }
|Tk_String      { $$=[{"name":$1}]; }
|Tk_char        { $$=[{"name":$1}]; }
;

//*************** ESTRUTURA DE LOS PARAMETROS QUE PUEDE RECIBIER UN METODO Y FUNCIONES *************
PARAMETROS:
TIPO-VARIABLE Tk_identificador                  {  $$=[{"name":"TIPO","children":$1},{"name":$2}]; }
|PARAMETROS ',' TIPO-VARIABLE Tk_identificador  {  $$=[{"name":"PARAM","children":$1},{"name":","},{"name":"TIPO","children":$3},{"name":$4}];  }
;


//******************INSTRUCCIONES ACEPTADAS DENTRO DE UNA CLASE********************
INSTRUCCIONES-CLASE:
VARIABLE                            { $$=[{"name":"VAR","children":$1}];    }
|ASIGNACION-A                       { $$= [{"name":"ASIG","children":$1}];  }
|METODO                             { $$= [{"name":"MET","children":$1}];   }
|METODO-MAIN                        { $$= [{"name":"MET","children":$1}];   }
|FUNCION                            { $$= [{"name":"FUN","children":$1}];   }
|INSTRUCCIONES-CLASE METODO         { $$= [{"name":"INSTRU","children":$1},{"name":"MET","children":$2}]; }
|INSTRUCCIONES-CLASE FUNCION        { $$= [{"name":"INSTRU","children":$1},{"name":"FUN","children":$2}]; }
|INSTRUCCIONES-CLASE VARIABLE       { $$= [{"name":"INSTRU","children":$1},{"name":"VAR","children":$2}]; }
|INSTRUCCIONES-CLASE ASIGNACION-A   { $$= [{"name":"INSTRU","children":$1},{"name":"ASIG","children":$2}]; }
|INSTRUCCIONES-CLASE METODO-MAIN    { $$= [{"name":"INSTRU","children":$1},{"name":"MAIN","children":$2}]; }
;


// INSTRUCCIONES ACEPTADAS DENTRO DE UN METODO MAIN
INSTRUCCIONES-MAIN:
VARIABLE                                { $$=[{"name":"VAR","children":$1} ];  }
|ASIGNACION-A                           { $$=[{"name":"ASIG","children":$1} ]; }
|LLAMADA-METODO                         { $$=[{"name":"MET","children":$1} ];  }
|FUNCION-IF                             { $$=[{"name":"FUN","children":$1} ];  }
|FUNCION-FOR                            { $$=[{"name":"FUN","children":$1} ];  }
|FUNCION-WHILE                          { $$=[{"name":"FUN","children":$1} ];  }
|FUNCION-DOWHILE                        { $$=[{"name":"FUN","children":$1} ];  }
|IMPRESION                              { $$=[{"name":"PRIN","children":$1} ]; }
|IMPRESION-SALTO                        { $$=[{"name":"PRIN","children":$1} ]; }
|RETORNO                                { $$=[{"name":"RETO","children":$1} ]; }
|Tk_identificador '+' '+' ';'           { $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4}]; }
|Tk_identificador '-' '-' ';'           { $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4}]; }
|INSTRUCCIONES-MAIN VARIABLE            { $$=[{"name":"INST","children":$1},{"name":"VAR","children":$2} ];  }
|INSTRUCCIONES-MAIN ASIGNACION-A        { $$=[{"name":"INST","children":$1},{"name":"ASIG","children":$2} ]; }
|INSTRUCCIONES-MAIN LLAMADA-METODO      { $$=[{"name":"INST","children":$1},{"name":"MET","children":$2} ];  }
|INSTRUCCIONES-MAIN FUNCION-IF          { $$=[{"name":"INST","children":$1},{"name":"FUN","children":$2} ];  }
|INSTRUCCIONES-MAIN FUNCION-FOR         { $$=[{"name":"INST","children":$1},{"name":"FUN","children":$2} ];  }
|INSTRUCCIONES-MAIN FUNCION-WHILE       { $$=[{"name":"INST","children":$1},{"name":"FUN","children":$2} ];  }
|INSTRUCCIONES-MAIN FUNCION-DOWHILE     { $$=[{"name":"INST","children":$1},{"name":"FUN","children":$2} ];  }
|INSTRUCCIONES-MAIN IMPRESION           { $$=[{"name":"INST","children":$1},{"name":"PRIN","children":$2} ]; }
|INSTRUCCIONES-MAIN IMPRESION-SALTO     { $$=[{"name":"INST","children":$1},{"name":"PINT","children":$2} ]; }
|INSTRUCCIONES-MAIN RETORNO             { $$=[{"name":"INST","children":$1},{"name":"RETO","children":$2} ]; }
|INSTRUCCIONES-MAIN Tk_identificador '+' '+' ';' { $$=[{"name":"INST","children":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5} ]; }
|INSTRUCCIONES-MAIN Tk_identificador '-' '-' ';' { $$=[{"name":"INST","children":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5} ]; }
;


//**************************** INSTRUCCIONES QUE PUEDE RECIBIR UNA INTERFACE EN JAVA ***********************************
INSTRUCCIONES-INTERFACE:
'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' ';'                                         { $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5},{"name":$6}]; }
|'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' ';'                             { $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":"PARA","children":$5},{"name":$6},{"name":$6}]; }
|INSTRUCCIONES-INTERFACE 'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' ')' ';'                { $$=[{"name":"INSTRU","children":$1},{"name":$2},{"name":"TIPO","children":$3},{"name":$4},{"name":$5},{"name":$6},{"name":$7}]; }
|INSTRUCCIONES-INTERFACE 'Tk_public' TIPO-RETORNO 'Tk_identificador' '(' PARAMETROS ')' ';'     { $$=[{"name":"INSTRU","children":$1},{"name":$2},{"name":"TIPO","children":$3},{"name":$4},{"name":$5},{"name":"PARA","children":$6},{"name":$7},{"name":$8}]; }
|error ';'                                                                                      { $$=[{}];  }
;


//********************* todas las instrucciones aceptadas dentro de los metodos *****************************************
INSTRUCCIONES-METODO:
VARIABLE                                            { $$=[{"name":"VAR","children":$1}];   }
|ASIGNACION-A                                       { $$=[{"name":"ASIG","children":$1}];  }
|FUNCION-IF                                         { $$=[{"name":"FUNC","children":$1}];  }
|FUNCION-FOR                                        { $$=[{"name":"FUNC","children":$1}];  }
|FUNCION-WHILE                                      { $$=[{"name":"FUNC","children":$1}];  }
|FUNCION-DOWHILE                                    { $$=[{"name":"FUNC","children":$1}];  }
|LLAMADA-METODO                                     { $$=[{"name":"MET","children":$1}];    }
|IMPRESION                                          { $$=[{"name":"PRINT","children":$1}];  }
|IMPRESION-SALTO                                    { $$=[{"name":"PRINT","children":$1}];  }
|RETORNO                                            { $$=[{"name":"RET","children":$1}];    }
|Tk_identificador '+' '+' ';'                       { $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4}]; }
|Tk_identificador '-' '-' ';'                       { $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4}]; }
|INSTRUCCIONES-METODO VARIABLE                      { $$= [{"name":"INSTRU","children":$1},{"name":"VAR","children":$2}];  }
|INSTRUCCIONES-METODO ASIGNACION-A                  { $$= [{"name":"INSTRU","children":$1},{"name":"ASIG","children":$2}]; }
|INSTRUCCIONES-METODO FUNCION-IF                    { $$= [{"name":"INSTRU","children":$1},{"name":"FUNC","children":$2}]; }
|INSTRUCCIONES-METODO FUNCION-FOR                   { $$= [{"name":"INSTRU","children":$1},{"name":"FUNC","children":$2}]; }
|INSTRUCCIONES-METODO FUNCION-WHILE                 { $$= [{"name":"INSTRU","children":$1},{"name":"FUNC","children":$2}]; }
|INSTRUCCIONES-METODO FUNCION-DOWHILE               { $$= [{"name":"INSTRU","children":$1},{"name":"FUNC","children":$2}]; }
|INSTRUCCIONES-METODO LLAMADA-METODO                { $$= [{"name":"INSTRU","children":$1},{"name":"MET","children":$2}];  }
|INSTRUCCIONES-METODO IMPRESION                     { $$= [{"name":"INSTRU","children":$1},{"name":"PRINT","children":$2}]; }
|INSTRUCCIONES-METODO IMPRESION-SALTO               { $$= [{"name":"INSTRU","children":$1},{"name":"PRINT","children":$2}]; }
|INSTRUCCIONES-METODO RETORNO                       { $$= [{"name":"INSTRU","children":$1},{"name":"RET","children":$2}];  }
|INSTRUCCIONES-METODO Tk_identificador '+' '+' ';'  { $$= [{"name":"INSTRU","children":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5}]; }
|INSTRUCCIONES-METODO Tk_identificador '-' '-' ';'  { $$= [{"name":"INSTRU","children":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5}]; }
;


// ASIGNACIONACIONES A UNA VARIABLE DECLARADAS
//********************* ASIGNACION A VARIABLES YA DECLARADAS ********************
ASIGNACION-A:
Tk_identificador '=' EXPRESION ';' { $$ = [ {"name":$1},{"name":"="},{"name":"EXP","children":$3},{"name":";"} ]; }
;


//********************** ESTRUCTURA DE UNA VARIABLE ******************************
VARIABLE:
TIPO-VARIABLE DECLARACION ';' { $$=[{"name":"TIPO","children":$1},{"name":"DEC","children":$2},{"name":";"}]; }
| ERROR ';'                   { $$=[]; }
;


//******************* TIPO DE VARIABLES ACEPTADAS EN JAVA **************************
TIPO-VARIABLE:
Tk_int          { $$=[{"name":$1}]; }
|Tk_boolean     { $$=[{"name":$1}]; }
|Tk_double      { $$=[{"name":$1}]; }
|Tk_String      { $$=[{"name":$1}]; }
|Tk_char        { $$=[{"name":$1}]; }
;


//******************* DECLARACION DE UNA O VARIAS VARIABLES ***************************
DECLARACION:
ASIGNACION                      { $$=[{"name":"ASIG","children":$1}]; }
| DECLARACION ',' ASIGNACION    { $$=[{"name":"DEC", "children":$1},{"name":","},{"name":"ASIG","children":$3}]; }
;


//***************** TIPOS DE ASIGNACION QUE SE LE PUEDE HACER A UNA VARIABLE ***********
ASIGNACION:
Tk_identificador '=' EXPRESION  { $$=[{"name":$1},{"name":"="},{"name":"EXP","children":$3}]; }
|Tk_identificador               { $$=[{"name":$1}]; }
;

//***************************** EXPRESIONES POSIBLE EN JAVA ******************************
EXPRESION:
EXPRESION '&' '&' EXPRESION     { $$=[{"name":"EXP","children":$1},{"name":"&"},{"name":"&"},{"name":"EXP","children":$4}]; }
|EXPRESION '|' '|' EXPRESION    { $$=[{"name":"EXP","children":$1},{"name":"|"},{"name":"|"},{"name":"EXP","children":$4}]; }
|EXPRESION '>' '=' EXPRESION    { $$=[{"name":"EXP","children":$1},{"name":">"},{"name":"="},{"name":"EXP","children":$4}]; }
|EXPRESION '<' '=' EXPRESION    { $$=[{"name":"EXP","children":$1},{"name":"<"},{"name":"="},{"name":"EXP","children":$4}]; }
|EXPRESION '=' '=' EXPRESION    { $$=[{"name":"EXP","children":$1},{"name":"="},{"name":"="},{"name":"EXP","children":$4}]; }
|EXPRESION '!' '=' EXPRESION    { $$=[{"name":"EXP","children":$1},{"name":"!"},{"name":"="},{"name":"EXP","children":$4}]; }
|EXPRESION '+' '+'              { $$=[{"name":"EXP","children":$1},{"name":"+"},{"name":"+"}]; }
|EXPRESION '-' '-'              { $$=[{"name":"EXP","children":$1},{"name":"-"},{"name":"-"}]; }
|EXPRESION '^' EXPRESION        { $$=[{"name":"EXP","children":$1},{"name":"^"},{"name":"EXP","children":$3}]; }
|EXPRESION '>' EXPRESION        { $$=[{"name":"EXP","children":$1},{"name":">"},{"name":"EXP","children":$3}]; }
|EXPRESION '<' EXPRESION        { $$=[{"name":"EXP","children":$1},{"name":"<"},{"name":"EXP","children":$3}]; }
|EXPRESION '*' EXPRESION        { $$=[{"name":"EXP","children":$1},{"name":"*"},{"name":"EXP","children":$3}]; }
|EXPRESION '/' EXPRESION        { $$=[{"name":"EXP","children":$1},{"name":"/"},{"name":"EXP","children":$3}]; }
|EXPRESION '+' EXPRESION        { $$=[{"name":"EXP","children":$1},{"name":"+"},{"name":"EXP","children":$3}]; }
|EXPRESION '-' EXPRESION        { $$=[{"name":"EXP","children":$1},{"name":"-"},{"name":"EXP","children":$3}]; }
|'(' EXPRESION ')'              { $$=[{"name":$1},{"name":"EXP","children":$2},{"name":$3}]; }
|'!' EXPRESION                  { $$=[{"name":"!"},{"name":"EXP","children":$2}]; }
|'-' EXPRESION %prec NEGATIVOS  { $$=[{"name":"-"},{"name":"EXP","children":$2}]; }    
|VALOR                          { $$=[{"name":"VALOR","children":$1}]; }
;


//********************** VALOR QUE SE LE PUEDE ASIGNAR DENTRO DE JAVA *************************
VALOR:
Tk_digito           {  $$=[{"name":$1}];  }
|Tk_decimal         {  $$=[{"name":$1}];  }
|Tk_cadena          {  $$=[{"name":$1}];  }
|Tk_cadenaChar      {  $$=[{"name":$1}];  }
|Tk_true            {  $$=[{"name":$1}];  }
|Tk_false           {  $$=[{"name":$1}];  }
|Tk_identificador   {  $$=[{"name":$1}];  }
;



//********************************** FUNCION IF PARA JAVA ************************************
FUNCION-IF:
IF                  { $$=[{"name":"IF","children":$1}]; }
|IF ELSE            { $$=[{"name":"IF","children":$1},{"name":"ELSE","children":$2}]; }
;

//****************************** puede venir un if  o un else if varias veces
IF:
Tk_if '(' EXPRESION   ')' '{'   INSTRUCCIONES-CICLOS   '}'                  { $$=[ {"name":$1},{"name":$2},{"name":"EXP","children":$3},{"name":$4},{"name":$5},{"name":"INST","children":$6},{"name":$7} ]; }
|Tk_if '(' EXPRESION ')' '{'   '}'                                          { $$=[{"name":$1},{"name":$2},{"name":"EXP","children":$3},{"name":$4},{"name":$5},{"name":$6}]; }
| IF 'Tk_else' Tk_if '('  EXPRESION   ')' '{'  INSTRUCCIONES-CICLOS  '}'    { $$=[ {"name":"FUN","children":$1},{"name":$2},{"name":$3},{"name":$4},{"name":"EXP","children":$5},{"name":$6},{"name":$7},{"name":"INS","children":$8},{"name":$9} ]; }
| IF 'Tk_else' Tk_if '(' EXPRESION ')' '{'   '}'                            { $$=[{"name":"FUN","children":$1},{"name":$2},{"name":$3},{"name":$4},{"name":"EXP","children":$5},{"name":$6},{"name":$7},{"name":$8}]; }
;



//******************************* ELSE PUEDE O NO PUEDE VENIR
ELSE:
Tk_else '{'  INSTRUCCIONES-CICLOS '}'   { $$=[ {"name":$1},{"name":$2},{"name":"INST","children":$3},{"name":$4} ]; }
|Tk_else '{'    '}'                     { $$=[{"name":$1},{"name":$2},{"name":$3}]; }
;
//************************************************************************************************ 



//**************************** estructura de la funcion for aceptada en java *********************************************
FUNCION-FOR:
Tk_for '(' DEC ';' EXPRESION ';' EXPRESION ')' '{'  INSTRUCCIONES-CICLOS  '}'   { $$=[{"name":$1},{"name":$2},{"name":"DEC","children":$3},{"name":$4},{"name":"EXP","children":$5},{"name":$6},{"name":"EXP","children":$7},{"name":$8},{"name":$9},{"name":"INST","name":$10},{"name":$11} ]; }
|Tk_for '(' DEC ';' EXPRESION ';' EXPRESION ')' '{' '}'                         { $$=[{"name":$1},{"name":$2},{"name":"DEC","children":$3},{"name":$4},{"name":"EXP","children":$5},{"name":$6},{"name":"EXP","children":$7},{"name":$8},{"name":$9},{"name":$10}]; }
;


//********** estrutura de dec que puede tener un for va dentro del for **************************************************** 
DEC:
TIPO-VARIABLE Tk_identificador '=' VALOR    { $$=[{"name":"TIPO","children":$1},{"name":$2},{"name":$3},{"name":"VALOR","children":$4}]; }
|Tk_identificador '=' VALOR                 { $$=[{"name":$1},{"name":$2},{"name":"VAL","children":$3}]; }
|Tk_identificador                           { $$=[{"name":$1}]; }
;


//*************************************************** estructura de un while ************************************************
FUNCION-WHILE:
Tk_while '(' EXPRESION ')' '{'  INSTRUCCIONES-CICLOS  '}'   { $$=[ {"name":$1},{"name":$2},{"name":"EXP","children":$3},{"name":$4},{"name":$5},{"name":"INST","children":$6},{"name":$7} ]; }
|Tk_while '(' EXPRESION ')' '{'  '}'                        { $$=[{"name":$1},{"name":$2},{"name":"EXP","children":$3},{"name":$4},{"name":$5},{"name":$6}]; }
;


// estructura de de un do while en java
FUNCION-DOWHILE:
Tk_do '{'  INSTRUCCIONES-CICLOS  '}' Tk_while '(' EXPRESION ')' ';'     { $$=[ {"name":$1},{"name":$2},{"name":"INST","children":$3},{"name":$4},{"name":$5},{"name":$6},{"name":"EXP","name":$7},{"name":$8},{"name":$9} ]; }
|Tk_do '{'  '}' Tk_while '(' EXPRESION ')' ';'                          { $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5},{"name":"EXP","children":$6},{"name":$7},{"name":$8}]; }
;



// bloque de sentencias que pueden venir dentro de un if
INSTRUCCIONES-CICLOS:
VARIABLE                                            { $$=[ {"name":"VAR","children":$1} ]; }
|ASIGNACION-A                                       { $$=[ {"name":"ASIG","children":$1} ]; }
|FUNCION-IF                                         { $$=[ {"name":"FUN","children":$1} ]; }
|FUNCION-FOR                                        { $$=[ {"name":"FUN","children":$1} ]; }
|FUNCION-WHILE                                      { $$=[ {"name":"FUN","children":$1} ]; }
|FUNCION-DOWHILE                                    { $$=[ {"name":"FUN","children":$1} ]; }
|LLAMADA-METODO                                     { $$=[ {"name":"MET","children":$1} ]; }
|IMPRESION                                          { $$=[ {"name":"PRIN","children":$1} ]; }
|IMPRESION-SALTO                                    { $$=[ {"name":"PRIN","children":$1} ]; }
|RETORNO                                            { $$=[ {"name":"RET","children":$1} ]; }
|Tk_identificador '+' '+' ';'                       { $$=[ {"name":$1},{"name":$2},{"name":$3},{"name":$4} ]; }
|Tk_identificador '-' '-' ';'                       { $$=[ {"name":$1},{"name":$2},{"name":$3},{"name":$4} ]; }
|INSTRUCCIONES-CICLOS FUNCION-IF                    { $$=[ {"name":"INST","children":$1},{"name":"FUN","children":$2} ]; }
|INSTRUCCIONES-CICLOS FUNCION-FOR                   { $$=[ {"name":"INST","children":$1},{"name":"FUN","children":$2} ]; }
|INSTRUCCIONES-CICLOS FUNCION-WHILE                 { $$=[ {"name":"INST","children":$1},{"name":"FUN","children":$2} ]; }
|INSTRUCCIONES-CICLOS FUNCION-DOWHILE               { $$=[ {"name":"INST","children":$1},{"name":"FUN","children":$2} ]; }
|INSTRUCCIONES-CICLOS LLAMADA-METODO                { $$=[ {"name":"INST","children":$1},{"name":"MET","children":$2} ]; }
|INSTRUCCIONES-CICLOS IMPRESION                     { $$=[ {"name":"INST","children":$1},{"name":"PRIN","children":$2} ]; }
|INSTRUCCIONES-CICLOS IMPRESION-SALTO               { $$=[ {"name":"INST","children":$1},{"name":"PRIN","children":$2} ]; }
|INSTRUCCIONES-CICLOS RETORNO                       { $$=[ {"name":"INST","children":$1},{"name":"RE","children":$2} ]; }
|INSTRUCCIONES-CICLOS Tk_identificador '+' '+' ';'  { $$=[ {"name":"INST","children":$1},{"name":$2},{"neme":$3},{"name":$4},{"name":$5} ]; }
|INSTRUCCIONES-CICLOS Tk_identificador '-' '-' ';'  { $$=[ {"name":"INST","children":$1},{"name":$2},{"neme":$3},{"name":$4},{"name":$5} ]; }
;




// estructura de una llamda a metodo
LLAMADA-METODO:
Tk_identificador '(' ')' ';'                            { $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4}]; }
|Tk_identificador '('  PARAMETROSEN-LLAMADA ')' ';'     { $$=[{"name":$1},{"name":$2},{"name":"PARAM","children":$3},{"name":$4},{"name":$5}];  }
;


//*********************  parametros para llamadas a metodos *******************************************
PARAMETROSEN-LLAMADA:
EXPRESION                              {  $$=[{"name":"EXP","children":$1}];  }
|PARAMETROSEN-LLAMADA ',' EXPRESION    {  $$=[{"name":"PARAM","children":$1},{"name":","},{"name":"EXP","children":$3}];  }
;


// tipos de retornos que pueden existir dentro de java
RETORNO:
Tk_break ';'                { $$=[{"name":$1},{"name":$2}]; }
|Tk_continue ';'            { $$=[{"name":$1},{"name":$2}]; }
|Tk_return ';'              { $$=[{"name":$1},{"name":$2}]; }
|Tk_return EXPRESION ';'    { $$=[{"name":$1},{"name":"EXP","children":$2},{"name":$3}]; }
;


//****************************** impresiones que se pueden realizar dentro java **********************************
IMPRESION:
Tk_System '.' Tk_out '.' 'Tk_print' '('   ')'  ';'                      {  $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5},{"name":$6},{"name":$7},{"name":$8}];  }
|Tk_System '.' Tk_out '.' 'Tk_print' '('  CADENA  ')'  ';'              {  $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5},{"name":$6},{"name":"CAD","children":$7},{"name":$8},{"name":$9}];  }
|Tk_System '.' Tk_out '.' 'Tk_print' '('  EXPRESION  ')'  ';'           {  $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5},{"name":$6},{"name":"EXP","children":$7},{"name":$8},{"name":$9}];  }
;


IMPRESION-SALTO:
Tk_System '.' Tk_out '.' 'Tk_println' '('  ')'  ';'                     {  $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5},{"name":$6},{"name":$7},{"name":$8}];  }
|Tk_System '.' Tk_out '.' 'Tk_println' '('  EXPRESION  ')'  ';'         {  $$=[{"name":$1},{"name":$2},{"name":$3},{"name":$4},{"name":$5},{"name":$6},{"name":"EXP","children":$7},{"name":$8},{"name":$9}];  }
;


ERROR:
error {console.log('error Sintactico:  '+yytext+'  fila: '+ this._$.first_line );}
;