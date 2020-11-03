/**
 * funcion para descar la traduccion del archivo javascript
 */
function dowloadJS()
{
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + '-' + hoy.getMinutes() + '-' + hoy.getSeconds();
    var fechaYHora = fecha + '_' + hora;    
    var data = document.getElementById('txt').value;
    //console.log(data);
    
    var nombre="ArchivoJS-"+fechaYHora+".java";//nombre del archivo
    var file=new Blob([data], {type: 'text/plain'});//archivo
    //descargar
    if(window.navigator.msSaveOrOpenBlob){
        window.navigator.msSaveOrOpenBlob(file, nombre);
    }else{
        var a=document.createElement("a"),url=URL.createObjectURL(file);
        a.href=url;
        a.download=nombre;
        document.body.appendChild(a);
        a.click();
        setTimeout(function(){
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        },0);}
}

/**
 * funcion para descargar la traduccion de python
 */
function dowloadPY()
{
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + '-' + hoy.getMinutes() + '-' + hoy.getSeconds();
    var fechaYHora = fecha + '_' + hora;
    var data = document.getElementById('txtpython').value;
    //
    var nombre="ArchivoPY-"+fechaYHora+".py";//nombre del archivo
    var file=new Blob([data], {type: 'text/plain'});//archivo
    //descargar
    if(window.navigator.msSaveOrOpenBlob){
        window.navigator.msSaveOrOpenBlob(file, nombre);
    }else{
        var a=document.createElement("a"),url=URL.createObjectURL(file);
        a.href=url;
        a.download=nombre;
        document.body.appendChild(a);
        a.click();
        setTimeout(function(){
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        },0);}
}

/**
 * funcion para descargar ambas traducciones
 */
function dowloadAmbos()
{
    dowloadJS();
    dowloadPY();
}

/*
*funcion para descargar y guardar como
*/
function saveAs(instacia)
{
    if(instacia==null){return alert("no se ha selecionado ninguna ventana");}
    else{
        var data = instacia.getValue();
        //
        var nombre=".java";//nombre del archivo
        var file=new Blob([data], {type: 'text/plain'});//archivo
        //descargar
        if(window.navigator.msSaveOrOpenBlob){
            window.navigator.msSaveOrOpenBlob(file, nombre);
        }else{
            var a=document.createElement("a"),url=URL.createObjectURL(file);
            a.href=url;
            a.download=nombre;
            document.body.appendChild(a);
            a.click();
            setTimeout(function(){
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            },0);}
        }
}
/**
 * 
 * metodo para guardar 
 */
function save(instacia,namePestania)
{
    if(instacia==null){return alert("no se ha selecionado ninguna ventana");}
    else{
        var pestania = document.getElementById(namePestania).innerText;
        //console.log(pestania);
        var data = instacia.getValue();
        //
        var nombre=pestania;//nombre del archivo
        var file=new Blob([data], {type: 'text/plain'});//archivo
        //descargar
        if(window.navigator.msSaveOrOpenBlob){
            window.navigator.msSaveOrOpenBlob(file, nombre);
        }else{
            var a=document.createElement("a"),url=URL.createObjectURL(file);
            a.href=url;
            a.download=nombre;
            document.body.appendChild(a);
            a.click();
            setTimeout(function(){
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            },0);}
        }
}