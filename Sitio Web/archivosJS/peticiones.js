/**
* funcion para analizar el texto cargado en codemirror
*/
function setInfo(){
    var url = 'http://localhost:3000/saludos';
    fetch(url,{
        method: 'GET',
    })
    .then(response => {
        console.log(response);
        return response.json();
    })
    .then(data => {
        console.log(data)
        txtjavascript = document.getElementById("txt");
        let saludo = data;
        console.log(saludo.saludo);
        txtjavascript.value = "";
        txtjavascript.value = saludo.saludo;
    })
    .catch(error =>{
        console.log("la peticion fallo"+error);
        alert("la peticon fallo con exito!");
    })              
}

/**
 * funcion para obtener la traduccion del codigo fuente
 */
function setInfo2(editor){
    var url = 'http://localhost:3000/analizar';
    var texto = 'public class animal{int var1=45;}';
    /*
    *verificar que se ha selecinado una tab desde el html para analizar
    */
    if(editor){
        console.log("**************************************");
        console.log("Se encontro una instacia para analizar");
        texto = editor.getValue();
        //console.log(texto)
        fetch(url,{
            method: 'POST',
            body: JSON.stringify({"codigo":texto}),
            headers: {"Content-Type":"application/json"}
        })
        .then(response => {
            console.log(response);
            return response.json()
        })
        .catch(error => {
            alert("la peticon fallo con exito!");
            return error
        })
        .then(data =>{
            console.log(data)
            txtjavascript = document.getElementById("txt");
            let saludo = data;
            console.log(saludo.translation)
            txtjavascript.value = saludo.translation;
        }) 
    }
    else{
        alert("Ninguna intacia selecionada");
    }
}