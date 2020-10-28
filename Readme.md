# Manual Tecnico

## Traduccion de JS

El analisis para la traduccion a JavaScript se ha generado utilizando la herrmaienta de [Jison](https://zaa.ch/jison/) de la cual fue sacada la traduccion, analisis lexico,sintactico,y reporte de tokens encontrados

## Traduccion de Pyhton

Para la traduccion a python, en el analisis previo de Java se ha ha realizado un traductor hecho sin herramientas para el cual se ha utilizdo el siguiente automata: 

![automata](https://github.com/hr9457/OLC1_Proyecto2_201314296/blob/master/Capturas/automata.PNG)

## Construccion de API

para la construccion de las apis para traductor en donde se la pagina principal hara las consultad se ha uitilizado [Node Js](https://nodejs.org/en/) para la cual se ha requerido los modulos de: 
* Express
* Cors
* Morgan

## Pagina Web 

En la pagina web ha sido construida con las herramientas de html,css y js

para la creacion de la los servicios y consumo de las api's de la pagina principal se utilizo el lenguaje de programacion **GO** 

# Manual Usuario

La aplicacion es una herramienta en la cual proporcionara al usuario la posibilidad de hacer la traduccion de un archivo escrito en Java a Javascript y Python con la posibilidad de ver un listado los tokens, errores lexicos, errores sintacticos y la grafica de un arbol ast


## Area de trabajo

En el area de trabajo la aplicacion presentara un menu 
interactivo en el cual se desplegaran varias utilidades que podemos aplicar sobre los editores.

Para la ediccion principal se mostrar un area de texto en el cual se podra caragar el archivo fuente el cual se desea analizar, esto teniedo en cuenta que podremos tener varias archivos abiertos al mismo tiempo, Aparte de ellos tendremos un apartado con otras dos areas de texto donde se mostarar la traduccion del archivo fuente.

![Principal](https://github.com/hr9457/OLC1_Proyecto2_201314296/blob/master/Capturas/Principal.PNG)

## Carga de un archvio

en la caraga de un archivo se ha colocado la opcion en el apartado de Menu en el cual podra cargar el archivo fuente que se analizar y colocandolo en el aparto o pestaña que se ha selecionado con anterioridad, en la cual tenra una implementacion para el pintado de palabras utilizando la erramienta [CodeMirror](https://codemirror.net/)

![Carga](https://github.com/hr9457/OLC1_Proyecto2_201314296/blob/master/Capturas/Carga.PNG)

## Analisis

Para el analisis de los archivos fuentes cargados en la pagina se utilizara las opciones de un pequeño sub-menu colocado arrbia de las pestañas en el cual se debera de selecionar la pestaña que se quiere analizar y luego de dar analizar se cargar las traducciones a JS y Python en el lado derecho.

![Analisis](https://github.com/hr9457/OLC1_Proyecto2_201314296/blob/master/Capturas/Analisis.PNG)


## Reportes

Los reportes que se proporcionar la pagina son:

* Reporte de Tokens Reconocidos
* Reporte de Errores Lexicos y Sintacticos
* Reporte Grafico del arbol AST

### Reportes de Tokens y Errores lexico

Para los reportes de los tokes generados y los errores lexico-sintacticos (si existieran) se desplegara una tabla en el cual se mostraran dichos tokens coon una breve descripcion de ellos 

![Reportes](https://github.com/hr9457/OLC1_Proyecto2_201314296/blob/master/Capturas/Tokens.PNG)

### Arbol AST

Para la presentacion del arbol **AST** de igual maneera se mostar en una ventaa diferente para la cual se ha utilizado la herramienta [D3](https://github.com/magjac/d3-graphviz) de [Graphviz](https://www.graphviz.org/resources/) la cual proporcinara al usuario una mejor navegacion entre los nodos que se pudieran produccir del archivo fuente analizado

![Arbol](https://github.com/hr9457/OLC1_Proyecto2_201314296/blob/master/Capturas/ast.PNG)