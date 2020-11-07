class sintactico {
    /**
     * metodo constructor con las utilidades para cada clase
     */
    constructor()
    {
        this.listaTokens2 = [];
        this.listaErrores = [];
        this.tokenPreanalisis;
        this.valorPreanalisis;
        this.posicionLista=0;
    }

    addError(tipo,fila,columna,descripcion)
    {
        this.listaErrores.push({Tipo:tipo,Fila:fila,Columna:columna,Descripcion:descripcion});
    }

    /**
     * metodo de parea
     */
    match(token)
    {
        if(token!=this.tokenPreanalisis)
        {
            //console.log('T envio:'+token+' diferente A: '+tokenPreanalisis);
            //this.addError('Sintactico',0,0,'se esperaba '+this.tokenPreanalisis);
            return false;
        }
        else
        {
            token = this.tokenPreanalisis;
            //console.log("Token: "+token+" hizo match con: "+tokenPreanalisis);
            this.posicionLista++;
            this.tokenPreanalisis = this.listaTokens2[this.posicionLista].Tipo;
            this.valorPreanalisis = this.listaTokens2[this.posicionLista].Token;
            return true;
        }
    }

    /**
     * metodo para la recuperacion de erroress
     */
    error()
    {
        //RECUPERACION ERROR
        while(this.tokenPreanalisis!='}')
        {
            this.posicionLista++;
            this.tokenPreanalisis = this.listaTokens2[this.posicionLista].Tipo;
            this.valorPreanalisis = this.listaTokens2[this.posicionLista].Token;
        }
    }


    /*
    *********************************************** analisis sintactico
    */
    analisisSintactico(listado)
    {
        console.log("inicio sintactico");
        this.listaTokens2 = listado;
        this.tokenPreanalisis = this.listaTokens2[0].Tipo;
        this.valorPreanalisis = this.listaTokens2[0].Token;
        var java = this.java2();//llamado a todo lo que acepta java
        //console.log(java);
        //return ''+java;
        if(java)
        {
            return [''+java,this.listaErrores];
        }
        else{
            return 'class Error:\n\tprint(Archivo de entrada mal escrito)';
        }
    }

    /**
     ******************************************* revision si existen tokens para analizar
    */
    java2()
    {
        switch(this.listaTokens2[this.posicionLista].Tipo)
        {
            case 'public':
                if(this.match('public')==false){return '';}
                var clase = this.clase_interface();
                if(this.listaTokens2[this.posicionLista].Tipo=='public')
                {
                    var recursividadJAVA = this.java2();
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
    clase_interface()
    {
        switch(this.listaTokens2[this.posicionLista].Tipo)
        {
            case 'class':
                if(this.match('class')==false){break;}
                var id = this.listaTokens2[this.posicionLista].Token;
                if(this.match('id')==false){break;}
                if(this.match('{')==false){break;}
                var bloque = this.bloqueInstruccionClase();
                if(this.match('}')==false){break;}
                return 'class '+id+':\n'+bloque;

            case 'interface':
                if(this.match('interface')==false){break;}
                var id = this.listaTokens2[this.posicionLista].Token;
                if(this.match('id')==false){break;}
                if(this.match('{')==false){break;}
                var bloque = this.bloqueInstruccionInterfaze();
                if(this.match('}')==false){break;}
                return 'class '+id+':\n'+bloque;
            default:
                return false;
        }
    }


    /**
     * bloque de instrucciones permitidas dentro de una clase
     */
    bloqueInstruccionInterfaze()
    {
        if(this.listaTokens2[this.posicionLista].Tipo=='public')
        {
            var retornoMETODOINT = this.metodosInterface();
            //recursividad
            if(this.listaTokens2[this.posicionLista].Tipo=='public')
            {
                var bloqueRecursivoInterfaze = this.bloqueInstruccionInterfaze();
                return '\t'+retornoMETODOINT+'\n'+bloqueRecursivoInterfaze;
            }
            return '\t'+retornoMETODOINT;
        }
        else
        {
            return '';
        }
    }

    metodosInterface()
    {
        this.match('public');
        this.tipoRetorno();
        var identificador = this.listaTokens2[this.posicionLista].Token;
        this.match('id');
        this.match('(');
        if(this.listaTokens2[this.posicionLista].Tipo==')')
        {
            this.match(')');
            this.match(';');
            return 'self '+identificador+' ();';
        }
        else 
        {
            var parametros = this.parametroJava();
            this.match(')');
            this.match(';');
            return 'self '+identificador+' ('+parametros+');';
        }
    }


    /**
     * bloque de instrucciones permitidas dentro de una clase
     */
    bloqueInstruccionClase()
    {
        if(this.listaTokens2[this.posicionLista].Tipo=='public')
        {
            this.match('public');
            if(this.listaTokens2[this.posicionLista].Tipo=='static')
            {//metodo main

                var funcionMain = this.metodoMain();
                //recursividad
                if(this.listaTokens2[this.posicionLista].Tipo=='public'||this.listaTokens2[this.posicionLista].Tipo=='id'
                ||this.listaTokens2[this.posicionLista].Tipo=='System'||this.tipoVariable()!=false)
                {
                    var bloque = this.bloqueInstruccionClase();
                    return '\t'+funcionMain+'\n'+bloque;
                }
                return '\t'+funcionMain;

            }
            else
            {//metodos o funciones

                var funcionOmetodo = this.funcion_MetodoJava();
                //recursividad
                if(this.listaTokens2[this.posicionLista].Tipo=='public'||this.listaTokens2[this.posicionLista].Tipo=='id'
                ||this.listaTokens2[this.posicionLista].Tipo=='System'||this.tipoVariable()!=false)
                {
                    var bloque = this.bloqueInstruccionClase();
                    return '\t'+funcionOmetodo+'\n'+bloque;
                }
                return '\t'+funcionOmetodo;

            }

        }    
        else if(this.listaTokens2[this.posicionLista].Tipo=='id')
        {//asignaciones a variables
            var retornoAsignacion = this.asignacionA();

            //recursividad
            if(this.listaTokens2[this.posicionLista].Tipo=='public'||this.listaTokens2[this.posicionLista].Tipo=='id'
            ||this.listaTokens2[this.posicionLista].Tipo=='System'||this.tipoVariable()!=false)
            {
                var bloque = this.bloqueInstruccionClase();
                return '\t'+retornoAsignacion+'\n'+bloque;
            }

            return '\t'+retornoAsignacion;
        }
        else if(this.existeTipoVariable()!=false)
        {//variabale en java
            var retornoVariable = this.variables();
            //recursividad
            if(this.listaTokens2[this.posicionLista].Tipo=='public'||this.listaTokens2[this.posicionLista].Tipo=='id'
            ||this.listaTokens2[this.posicionLista].Tipo=='System'||this.existeTipoVariable()!=false)
            {
                var bloque = this.bloqueInstruccionClase();
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
    metodoMain()
    {
        this.match('static');
        this.match('void');
        this.match('main');
        this.match('(');
        this.match('String');
        this.match('[');
        this.match(']');
        var identificador = this.listaTokens2[this.posicionLista].Token;
        this.match('id');
        this.match(')');
        this.match('{');
        //posibilidad de que el main vengo o no con instrucciones
        if(this.listaTokens2[this.posicionLista].Tipo=='}')
        {
            this.match('}');
            return 'def main():';
        }
        else
        {
            var BLOQUEMAIN = this.bloqueInstuccionMain();
            this.match('}');
            return 'def main():\n\t'+BLOQUEMAIN;
        }    
    }


    /**
     * bloque de instruccines permitidas dentro del metodo main
     */
    bloqueInstuccionMain()
    {
        if(this.listaTokens2[this.posicionLista].Tipo=='id')
        {//asignacionesA,llamada a un metodo,incremento o decremento
            
            var retornoSUB = this.subBloque();

            //recursividad
            if(this.listaTokens2[this.posicionLista].Tipo=='id'||this.listaTokens2[this.posicionLista].Tipo=='if'
            ||this.listaTokens2[this.posicionLista].Tipo=='for'||this.listaTokens2[this.posicionLista].Tipo=='while'
            ||this.listaTokens2[this.posicionLista].Tipo=='do'||this.listaTokens2[this.posicionLista].Tipo=='System'
            ||this.listaTokens2[this.posicionLista].Tipo=='while'||this.listaTokens2[this.posicionLista].Tipo=='break'
            ||this.listaTokens2[this.posicionLista].Tipo=='continue'||this.listaTokens2[this.posicionLista].Tipo=='return'
            ||this.tipoVariable()!=false)
            {
                var BLOQUE = this.bloqueInstuccionMain();
                return '\t'+retornoSUB+'\n\t'+BLOQUE;
            }
            return '\t'+retornoSUB;

        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='if')
        {
            var retornoIF = this.funcionIFELSE();
            
            //recursividad
            if(this.listaTokens2[this.posicionLista].Tipo=='id'||this.listaTokens2[this.posicionLista].Tipo=='if'
            ||this.listaTokens2[this.posicionLista].Tipo=='for'||this.listaTokens2[this.posicionLista].Tipo=='while'
            ||this.listaTokens2[this.posicionLista].Tipo=='do'||this.listaTokens2[this.posicionLista].Tipo=='System'
            ||this.listaTokens2[this.posicionLista].Tipo=='while'||this.listaTokens2[this.posicionLista].Tipo=='break'
            ||this.listaTokens2[this.posicionLista].Tipo=='continue'||this.listaTokens2[this.posicionLista].Tipo=='return'
            ||this.tipoVariable()!=false)
            {
                var BLOQUE = this.bloqueInstuccionMain();
                return '\t'+retornoIF+'\n\t'+BLOQUE;
            }
            return '\t'+retornoIF;

        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='for')
        {
            var retornoFOR = this.funcionFor();
            
            //recursividad
            if(this.listaTokens2[this.posicionLista].Tipo=='id'||this.listaTokens2[this.posicionLista].Tipo=='if'
            ||this.listaTokens2[this.posicionLista].Tipo=='for'||this.listaTokens2[this.posicionLista].Tipo=='while'
            ||this.listaTokens2[this.posicionLista].Tipo=='do'||this.listaTokens2[this.posicionLista].Tipo=='System'
            ||this.listaTokens2[this.posicionLista].Tipo=='while'||this.listaTokens2[this.posicionLista].Tipo=='break'
            ||this.listaTokens2[this.posicionLista].Tipo=='continue'||this.listaTokens2[this.posicionLista].Tipo=='return'
            ||this.tipoVariable()!=false)
            {
                var BLOQUE = this.bloqueInstuccionMain();
                return '\t'+retornoFOR+'\n\t'+BLOQUE;
            }
            return '\t'+retornoFOR;

        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='while')
        {
            var retornoWHILE = this.funcionWhile();
            
            //recursividad
            if(this.listaTokens2[this.posicionLista].Tipo=='id'||this.listaTokens2[this.posicionLista].Tipo=='if'
            ||this.listaTokens2[this.posicionLista].Tipo=='for'||this.listaTokens2[this.posicionLista].Tipo=='while'
            ||this.listaTokens2[this.posicionLista].Tipo=='do'||this.listaTokens2[this.posicionLista].Tipo=='System'
            ||this.listaTokens2[this.posicionLista].Tipo=='while'||this.listaTokens2[this.posicionLista].Tipo=='break'
            ||this.listaTokens2[this.posicionLista].Tipo=='continue'||this.listaTokens2[this.posicionLista].Tipo=='return'
            ||this.tipoVariable()!=false)
            {
                var BLOQUE = this.bloqueInstuccionMain();
                return '\t'+retornoWHILE+'\n\t'+BLOQUE;
            }
            return '\t'+retornoWHILE;

        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='do')
        {
            var retornoDOWHILE = this.funcionDoWhile();
            
            //recursividad
            if(this.listaTokens2[this.posicionLista].Tipo=='id'||this.listaTokens2[this.posicionLista].Tipo=='if'
            ||this.listaTokens2[this.posicionLista].Tipo=='for'||this.listaTokens2[this.posicionLista].Tipo=='while'
            ||this.listaTokens2[this.posicionLista].Tipo=='do'||this.listaTokens2[this.posicionLista].Tipo=='System'
            ||this.listaTokens2[this.posicionLista].Tipo=='while'||this.listaTokens2[this.posicionLista].Tipo=='break'
            ||this.listaTokens2[this.posicionLista].Tipo=='continue'||this.listaTokens2[this.posicionLista].Tipo=='return'
            ||this.tipoVariable()!=false)
            {
                var BLOQUE = this.bloqueInstuccionMain();
                return '\t'+retornoDOWHILE+'\n\t'+BLOQUE;
            }
            return '\t'+retornoDOWHILE;

        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='System')
        {
            var retornoIMPRESION = this.impresiones();
            
            //recursividad
            if(this.listaTokens2[this.posicionLista].Tipo=='id'||this.listaTokens2[this.posicionLista].Tipo=='if'
            ||this.listaTokens2[this.posicionLista].Tipo=='for'||this.listaTokens2[this.posicionLista].Tipo=='while'
            ||this.listaTokens2[this.posicionLista].Tipo=='do'||this.listaTokens2[this.posicionLista].Tipo=='System'
            ||this.listaTokens2[this.posicionLista].Tipo=='while'||this.listaTokens2[this.posicionLista].Tipo=='break'
            ||this.listaTokens2[this.posicionLista].Tipo=='continue'||this.listaTokens2[this.posicionLista].Tipo=='return'
            ||this.tipoVariable()!=false)
            {
                var BLOQUE = this.bloqueInstuccionMain();
                return '\t'+retornoIMPRESION+'\n\t'+BLOQUE;
            }
            return '\t'+retornoIMPRESION;

        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='break'||this.listaTokens2[this.posicionLista].Tipo=='continue'
        ||this.listaTokens2[this.posicionLista].Tipo=='return')
        {
            var retornoQUIEBRE = this.retornos();
            
            //recursividad
            if(this.listaTokens2[this.posicionLista].Tipo=='id'||this.listaTokens2[this.posicionLista].Tipo=='if'
            ||this.listaTokens2[this.posicionLista].Tipo=='for'||this.listaTokens2[this.posicionLista].Tipo=='while'
            ||this.listaTokens2[this.posicionLista].Tipo=='do'||this.listaTokens2[this.posicionLista].Tipo=='System'
            ||this.listaTokens2[this.posicionLista].Tipo=='while'||this.listaTokens2[this.posicionLista].Tipo=='break'
            ||this.listaTokens2[this.posicionLista].Tipo=='continue'||this.listaTokens2[this.posicionLista].Tipo=='return'
            ||this.tipoVariable()!=false)
            {
                var BLOQUE = this.bloqueInstuccionMain();
                return '\t'+retornoQUIEBRE+'\n\t'+BLOQUE;
            }
            return '\t'+retornoQUIEBRE;

        }
        else if(this.existeTipoVariable()!=false)
        {
            var retornoVariable = this.variables();
            
            //recursividad
            if(this.listaTokens2[this.posicionLista].Tipo=='id'||this.listaTokens2[this.posicionLista].Tipo=='if'
            ||this.listaTokens2[this.posicionLista].Tipo=='for'||this.listaTokens2[this.posicionLista].Tipo=='while'
            ||this.listaTokens2[this.posicionLista].Tipo=='do'||this.listaTokens2[this.posicionLista].Tipo=='System'
            ||this.listaTokens2[this.posicionLista].Tipo=='while'||this.listaTokens2[this.posicionLista].Tipo=='break'
            ||this.listaTokens2[this.posicionLista].Tipo=='continue'||this.listaTokens2[this.posicionLista].Tipo=='return'
            ||this.existeTipoVariable()!=false)
            {
                var BLOQUE = this.bloqueInstuccionMain();
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
    funcion_MetodoJava()
    {
        this.tipoRetorno();
        var identificador = this.listaTokens2[this.posicionLista].Token;
        this.match('id');
        this.match('(');
        /**
         * revision de entrada de parametros
         * 1. sin parametros 
         * 2. con parametros
         */
        if(this.listaTokens2[this.posicionLista].Tipo==')')
        {
            this.match(')');
            if(this.listaTokens2[this.posicionLista].Tipo=='{')//funcion
            {
                this.match('{');
                if(this.listaTokens2[this.posicionLista.Tipo=='}'])
                {
                    this.match('}');
                    return 'def '+identificador+' ():';
                }
                else
                {
                    var bloqueInstru = this.bloqueInstuccionMain();
                    this.match('}');
                    return 'def '+identificador+' ():\n\t'+bloqueInstru;
                }
            }
            else if(this.listaTokens2[this.posicionLista].Tipo==';')//metodo
            {
                this.match(';');
                return 'self '+identificador+' ();';
            }

        }
        else
        {
            var parametros = this.parametroJava();
            this.match(')');
            if(this.listaTokens2[this.posicionLista].Tipo=='{')//funcion
            {            
                this.match('{');
                if(this.listaTokens2[this.posicionLista].Tipo=='}')
                {
                    this.match('}');
                    return 'def '+identificador+' ( '+parametros+' ):';
                }
                else
                {   
                    var bloqueInstru = this.bloqueInstuccionMain();
                    this.match('}');
                    return 'def '+identificador+' ():\n\t'+bloqueInstru;             
                }            
            }
            else if(this.listaTokens2[this.posicionLista].Tipo==';')//metodo
            {
                this.match(';');
                return 'self '+identificador+' ( '+parametros+' );';
            }

        } 
    }


    /**
     * metod para llamar a una llamada a metodo o incremento o decremento, asignacion A
     */
    subBloque()
    {
        var identificador = this.listaTokens2[this.posicionLista].Token;
        this.match('id');
        if(this.listaTokens2[this.posicionLista].Tipo=='=')
        {
            this.match('=');
            var exp = this.expresion();
            this.match(';');
            return ''+identificador+'='+exp;
        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='(')
        {
            this.match('(');
            if(this.listaTokens2[this.posicionLista].Tipo==')')
            {
                this.match(')');
                this.match(';');
                return ''+identificador+'()';
            }
            else
            {
                var retornoPARAMETROS = this.parametroJava();
                this.match(')');
                this.match(';');
                return ''+identificador+'('+retornoPARAMETROS+')';
            } 
        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='+')
        {   
            this.match('+');
            this.match('+');
            this.match(';');
            return ''+identificador+'++';        
        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='-')
        {   
            this.match('-');
            this.match('-');
            this.match(';');
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
    funcionLlamadaMetodo()
    {
        var identificador = this.listaTokens2[this.posicionLista].Token;
        this.match('id');
        this.match('(');
        if(this.listaTokens2[this.posicionLista].Tipo==')')
        {
            this.match(')');
            this.match(';');
            return ''+identificador+'()';
        }
        else
        {
            var retornoPARAMETROS = this.parametroJava();
            this.match(')');
            this.match(';');
            return ''+identificador+'('+retornoPARAMETROS+')';
        }    
    }

    incrementoDecremento()
    {
        var identificador = this.listaTokens2[this.posicionLista].Token;
        this.match('id');
        if(this.listaTokens2[this.posicionLista].Tipo=='+')
        {        
            this.match('+');
            this.match('+');
            return identificador+'++';
        }
        else
        {
            this.match('-');
            this.match('-');
            return identificador+'--';
        }
    }



    /**
     * parametros para metodos y funciones
     */
    parametroJava()
    {
        var tipo = this.tipoVariable();
        var identificador = this.listaTokens2[this.posicionLista].Token;
        this.match('id');
        if(this.listaTokens2[this.posicionLista].Token==',')
        {
            this.match(',');
            var parametro = this.parametroJava();
            return identificador+','+parametro;
        }
        return ''+identificador;
    }

    /**
     * asignaciones a variables permitidas dentro de java
     */
    asignacionA()
    {
        var identificador = this.listaTokens2[this.posicionLista].Token;
        this.match('id');
        this.match('=');
        var exp = this.expresion();
        this.match(';');
        return identificador+'='+exp;
    }

    //TODO: modifique a la hora de aceder al tipo de variable
    /**
     * Estructura de variables aceptadas
     */
    variables()
    {
        var tipo = this.tipoVariable();
        var declaRacion = this.declaracion();
        this.match(';');
        return 'var '+declaRacion;
    }

    /**
     **  declaracion  que pueden llevar una variable
    */
    declaracion()
    {
        var asigNacion = this.asignacion();
        if(this.listaTokens2[this.posicionLista].Tipo==',')
        {
            this.match(',');
            var asignacionMulti = this.declaracion();
            return asigNacion +','+asignacionMulti;
        }
        return ''+asigNacion;
    }


    /**
     **  asignaciones a una variable
    */
    asignacion()
    {
        var identificador = this.listaTokens2[this.posicionLista].Token;
        this.match('id');
        if(this.listaTokens2[this.posicionLista].Tipo=='=')
        {
            this.match('=');
            var exp = this.expresion();
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
    funcionWhile()
    {
        this.match('while');
        this.match('(');
        var exp = this.expresion();
        this.match(')');
        this.match('{');
        if(this.listaTokens2[this.posicionLista].Tipo=='}')
        {
            this.match('}');
            return 'while '+exp+':';
        }  
        else
        {
            var bloque = this.bloqueInstuccionMain();
            this.match('}');
            return 'while '+exp+':\n\t'+bloque;
        }  
    }

    /**
     * funcion do while aceptada en java
     */
    funcionDoWhile()
    {
        this.match('do');
        this.match('{');
        if(this.listaTokens2[this.posicionLista].Tipo=='}')
        {
            this.match('}')
            this.match('while');
            this.match('(');
            var exp = this.expresion();
            this.match(')');
            this.match(';');
            return 'while '+exp+':';
        }
        else
        {
            var bloqueInstru = this.bloqueInstuccionMain();
            this.match('}')
            this.match('while');
            this.match('(');
            var exp = this.expresion();
            this.match(')');
            this.match(';');
            return 'while '+exp+':\n\t'+bloqueInstru;
        }    
    }


    /**
     * estructura de un funcion for aceptada en java
     */
    funcionFor()
    {
        this.match('for');
        this.match('(');
        var declaracion = this.dec();
        this.match(';');
        var exp = this.expresion();
        this.match(';');
        var exp2 = this.expresion();
        this.match(')');
        this.match('{');
        if(this.listaTokens2[this.posicionLista].Tipo=='}')
        {
            this.match('}');
            return 'for '+declaracion+' in range ('+exp+','+exp2+'):';
        }
        else
        {
            var bloqueInstru = this.bloqueInstuccionMain();
            this.match('}');
            return 'for '+declaracion+' in range ('+exp+','+exp2+'):\n\t\t'+bloqueInstru;
        }    
    }

    /**
     * sintaxis de una declaracion para el ciclo for
     */
    dec()
    {
        if(this.listaTokens2[this.posicionLista].Tipo=='id')
        {
            var identificador = this.listaTokens2[this.posicionLista].Token;
            this.match('id');
            if(this.listaTokens2[this.posicionLista].Tipo=='=')
            {
                this.match('=');
                var vaLor = this.valor();
                return ''+identificador+'='+vaLor;
            }    
            return ''+identificador; 
        }     
        else 
        {
            var tipo = this.tipoVariable();
            var identificador = this.listaTokens2[this.posicionLista].Token;
            this.match('id');
            this.match('=');
            var vaLor = this.valor();
            return ''+identificador+'='+vaLor;
        }
    }

    /**
     * estructura de una funcion if aceptda en java
     */
    funcionIFELSE()
    {
        var restuldoif = this.funcionIF();
        if(this.listaTokens2[this.posicionLista].Tipo=='else')
        {
            var resultadoElif = this.funcionELSE_ELIF();
            return ''+restuldoif+'\n\t\t'+resultadoElif;
        }
        return ''+restuldoif;
    }

    /**
     * parte superrio de un if
     */
    funcionIF()
    {
        this.match('if');
        this.match('(');
        var retornoExpression = this.expresion();
        this.match(')');
        this.match('{');
        if(this.listaTokens2[this.posicionLista].Tipo=='}')
        {
            this.match('}');
            return 'if '+retornoExpression+':';
        }
        else
        {
            var bloqueInstru = this.bloqueInstuccionMain();
            this.match('}');
            return 'if '+retornoExpression+':\n\t\t'+bloqueInstru;
        }
    }

    /**
     * estructrua de  else 
     */
    funcionELSE_ELIF()
    {
        this.match('else');
        //si viene un else if
        if(this.listaTokens2[this.posicionLista].Tipo=='if')
        {
            var retornoELSEIF = this.funcionELIF();
            if(this.listaTokens2[this.posicionLista].Tipo=='else')
            {
                var retornoRECURSIVO = this.funcionELSE_ELIF();
                return ''+retornoELSEIF+'\n\t\t'+retornoRECURSIVO;
            }
            return ''+retornoELSEIF;
        }
        var retornoElse = this.funcionELSE();
        return ''+retornoElse;
    }

    /**
     * agreacion para un else if dentro del if
     */
    funcionELIF()
    {
        this.match('if');
        this.match('(');
        var retornoExpression = this.expresion();
        this.match(')');
        this.match('{');
        if(this.listaTokens2[this.posicionLista].Tipo=='}')
        {
            this.match('}');
            return 'elif '+retornoExpression+':';
        }
        else
        {
            var bloqueInstru = this.bloqueInstuccionMain();
            this.match('}');
            return 'elif '+retornoExpression+':\n\t\t'+bloqueInstru;      
        }    
    }

    /**
     * agregacion else para un if
     */
    funcionELSE()
    {
        this.match('{');
        if(this.listaTokens2[this.posicionLista].Tipo=='}')
        {
            this.match('}');
            return 'else:';
        }
        else
        {
            var bloqueInstru = this.bloqueInstuccionMain();
            this.match('}');
            return 'else :\n\t\t'+bloqueInstru;      
        }     
    }    



    /**
     * impresiones por consola aceptadas en java
     */
    impresiones()
    {
        this.match('System');
        this.match('.');
        this.match('out');
        this.match('.');
        if(this.listaTokens2[this.posicionLista].Tipo=='print')
        {
            this.match('print');
            this.match('(');
            var retornoExpresion = this.expresion();
            this.match(')');
            this.match(';');
            return 'print( '+retornoExpresion+' )';
        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='println')
        {
            this.match('println');
            this.match('(');
            var retornoExpresion = this.expresion();
            this.match(')');
            this.match(';');
            return 'print( '+retornoExpresion+' )';
        }    
    }

    /**
     * tipos de retornos para funciones y otros
     */
    retornos()
    {
        switch(this.listaTokens2[this.posicionLista].Tipo)
        {
            case 'break':
                this.match('break');
                this.match(';');
                return 'break';
            case 'continue':
                this.match('continue');
                this.match(';');
                return 'continue';
            case 'return':
                this.match('return');
                if(this.listaTokens2[this.posicionLista].Tipo==';')
                {this.match(';'); return 'return';}
                else{var retornoExpresion = this.expresion(); this.match(';');return 'return '+retornoExpresion;}
            default:
                return false;
        }
    }



    //TODO:falta agregar icremento y decremento
    /**
     ** tipos de expresiones aceptadas en java
    */
    expresion()
    {
        if(this.listaTokens2[this.posicionLista].Tipo=='!')
        {
            this.match('!');
            var exp = this.expresion()
            return 'not '+exp;        
        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='(')
        {
            this.match('(');
            var exp = this.expresion();
            this.match(')');
            return '('+exp+')';
        }
        else if(this.listaTokens2[this.posicionLista].Tipo=='-')
        {
            this.match('-');
            var exp = this.expresion();
            if(exp=='false')
            {
                return '-';
            }
            return '-'+exp;
        }
        else
        {
            var vaLor = this.valor();
            if(this.listaTokens2[this.posicionLista].Tipo=='&')
            {
                this.match('&');
                this.match('&');
                var exp = this.expresion();
                return ''+vaLor+' and '+exp;
            }
            else if(this.listaTokens2[this.posicionLista].Tipo=='|')
            {
                this.match('|');
                this.match('|');
                var exp = this.expresion();
                return ''+vaLor+' or '+exp;
            }
            else if(this.listaTokens2[this.posicionLista].Tipo=='^')
            {
                this.match('^');
                var exp = this.expresion();
                return ''+vaLor+' xor '+exp;
            }
            else if(this.listaTokens2[this.posicionLista].Tipo=='>')
            {
                this.match('>');
                if(this.listaTokens2[this.posicionLista].Tipo=='=')
                {
                    this.match('=');
                    var exp = this.expresion();
                    return ''+vaLor+' >= '+exp;
                }
                else
                {
                    var exp = this.expresion();
                    return ''+vaLor+' > '+exp;
                }
            }
            else if(this.listaTokens2[this.posicionLista].Tipo=='<')
            {
                this.match('<');
                if(this.listaTokens2[this.posicionLista].Tipo=='=')
                {
                    this.match('=');
                    var exp = this.expresion();
                    return ''+vaLor+' <= '+exp;
                }
                else
                {
                    var exp = this.expresion();
                    return ''+vaLor+' < '+exp;
                }            
            }
            else if(this.listaTokens2[this.posicionLista].Tipo=='=')
            {
                this.match('=');
                this.match('=');
                var exp = this.expresion();
                return ''+vaLor+' == '+exp;
            }
            else if(this.listaTokens2[this.posicionLista].Tipo=='!')
            {
                this.match('!');
                if(this.listaTokens2[this.posicionLista].Tipo=='=')
                {
                    this.match('=');
                    var exp = this.expresion();
                    return ''+vaLor+' != '+exp;
                }
                var exp = this.expresion();
                return ''+vaLor+' not '+exp;
            }
            else if(this.listaTokens2[this.posicionLista].Tipo=='+')
            {
                this.match('+');
                if(this.listaTokens2[this.posicionLista].Tipo=='+')
                {
                    this.match('+');
                    return ''+vaLor+'++';
                }
                var exp = this.expresion();
                return ''+vaLor+'+'+exp;
            }
            else if(this.listaTokens2[this.posicionLista].Tipo=='-')
            {
                this.match('-');
                var exp = this.expresion();
                return ''+vaLor+'-'+exp;
            }
            else if(this.listaTokens2[this.posicionLista].Tipo=='*')
            {
                this.match('*');
                var exp = this.expresion();
                return ''+vaLor+'*'+exp;
            }
            else if(this.listaTokens2[this.posicionLista].Tipo=='/')
            {
                this.match('/');
                var exp = this.expresion();
                return ''+vaLor+'/'+exp;
            }
            return ''+vaLor; 
        }
    }

    /**
     ************************************************** tipos de variables aceptadas
    */
    existeTipoVariable()
    {
        switch(this.listaTokens2[this.posicionLista].Tipo)
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

    tipoVariable()
    {
        switch(this.listaTokens2[this.posicionLista].Tipo)
        {
            case 'int':
                this.match('int');
                return true;
            case 'boolean': 
                this.match('boolean');
                return true;
            case 'double':
                this.match('double');
                return true;
            case 'String':
                this.match('String');
                return true;
            case 'char':
                this.match('char');
                return true;
            default:
                return false;
        }
    }

    /**
     ** valores aceptados en java
    */
    valor()
    {
        switch(this.listaTokens2[this.posicionLista].Tipo)
        {
            case 'digito':
                var vaLor = this.listaTokens2[this.posicionLista].Token;
                this.match('digito');
                return ''+vaLor;
            case 'decimal':
                var vaLor = this.listaTokens2[this.posicionLista].Token; 
                this.match('decimal');
                return ''+vaLor;
            case 'stringCadena': 
                var vaLor = this.listaTokens2[this.posicionLista].Token;
                this.match('stringCadena');
                return ''+vaLor;
            case 'charCadena':
                var vaLor = this.listaTokens2[this.posicionLista].Token;
                this.match('charCadena');
                return ''+vaLor;
            case 'true':
                var vaLor = this.listaTokens2[this.posicionLista].Token;
                this.match('true');
                return ''+vaLor;
            case 'false':
                var vaLor = this.listaTokens2[this.posicionLista].Token;
                this.match('false');
                return ''+vaLor;
            case 'id':
                var vaLor = this.listaTokens2[this.posicionLista].Token;
                this.match('id');
                return ''+vaLor;
            default:
                return false;
        }
    }

    /**
     * tipos de retornos aceptados en funciones y metodos
     */
    tipoRetorno()
    {
        switch(this.listaTokens2[this.posicionLista].Tipo)
        {
            case 'void':
                this.match('void');
                break;
            case 'int':
                this.match('int');
                break;
            case 'boolean':
                this.match('boolean');
                break;
            case 'String':
                this.match('String');
                break;
            case 'char':
                this.match('char');
                break;
            default:
                return false;
        }
    }


}//fin de la clase

module.exports = sintactico;
























