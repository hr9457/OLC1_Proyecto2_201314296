// IMPORTACIONES
%{
    //codigo en javascript
%}

// BLOQUE DE ANALISIS LEXICO

%lex 

%options case-sensitive

%%
// expreciones regulares
[0-9]+\b    {}  

/lex 
// FIN DEL BLOQUE DEL ANALISIS LEXICO 