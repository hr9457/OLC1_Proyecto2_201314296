// IMPORTACIONES
%{
    console.log("*************************UTILIDADES*******************************")
%}

//------------------------------------------------------------------------------------------------
// BLOQUE DE ANALISIS LEXICO

%lex 

//  ANALIZADOR SE SENSIBLE
%options case-sensitive


// MARCADAO DE INICIO - TODO LO NECESARIO EN EL ANALIZADOR LEXICO
%%

/*
ANALISI LEXICO MANEJA PRIORIDADES ENTRE LO QUE UNO DEFINE
*/

// EXPRESIONES REGULARES  PARA ACEPTACION DE CADENAS ESPECIALES POR EL LENGUAJE JAVA 6

// espacios, tabulaciones, nuevas lines
\s+  {}

// aceptacion de numeros decimales
[0-9]+.[0-9]+    {return 'Tk_decimal';}

// aceptacion de digitos de 0 a 9
[0-9]+ {return 'Tk_digito';}

//  comentario unilinea
\/\/.*  {}

// comentario multilinea
\/\*(\*(?!\/)|[^*])*\*\/    {}



//*********************************************
// PALABRAS RESEREVADAS POR EL LENGUAJE JAVA 25

"public"    {return 'Tk_public';}
"class"     {return 'TK_class';}
"args"      {return 'Tk_args';}
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
// SIMBOLOS  RECONOCIDOS POR EL LENGUAJE JAVA 18
"{" {return 'Tk_llaveApertura';}
"}" {return 'Tk_llaveCierre';}
"(" {return 'Tk_parentesisApertura';}
")" {return 'Tk_parentesisCierre';}
"," {return 'Tk_coma';}
"." {return 'Tk_punto';}
";" {return 'Tk_puntoComa';}
"<" {return 'Tk_menorQue';}
">" {return 'Tk_mayorQue';}
"&" {return 'Tk_and';}
"|" {return 'Tk_or';}
"!" {return 'Tk_not';}
"^" {return 'Tk_elevadoXor';}
"=" {return 'Tk_igual';}
"+" {return 'Tk_mas';}
"-" {return 'Tk_menos';}
"*" {return 'Tk_multiplicacion';}
"/" {return 'Tk_division';}


//  secuencia para aceptar un identificador letras,numero y _ inicio o en medio
_?[a-zA-Z_]+[0-9_?]*  {return 'Tk_identificador';}

// captura para erroles lexico , cualquier caracter, excepto los que ya definimos
.   {console.log("Error Lexico");}


//**********************
//  FINAL DEL ARCHIVO
<<EOF>> {return 'EOF';}


/lex 
// FIN DEL BLOQUE DEL ANALISIS LEXICO 



//-----------------------------------------------------------------------------------------------
//  BLOQUE DE ANALISIS SINTACTICO
%start INICIO
%%

INICIO: EOF {} ;
