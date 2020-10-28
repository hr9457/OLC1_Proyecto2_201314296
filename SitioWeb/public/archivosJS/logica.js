/**
 * instacia
 */
var instacia;

/**
 * funcion para cara un archivo de entrda
 */
function aperturaArchivo(editor) {
    var input = document.createElement('input');
    input.type = 'file';
    input.id = 'archivo';    
    input.accept = '.java'; // extencion a permitir  
    input.addEventListener('change',function readFiles(event) {                            
        var fileList = event.target.files;
        
    
            for(var i=0; i < fileList.length; i++ ) {
                loadAsText(fileList[i],editor);                                        
            }
        });
    input.click();    
}

function loadAsText(theFile,editor) {
    var reader = new FileReader();

    reader.onload = function(loadedEvent) {
        //console.log(loadedEvent.target.result);
        //$('#txt').append(loadedEvent.target.result);
        var texto = toString(loadedEvent.target.result);
        editor.setValue("public class Persona{}");
    }
    reader.readAsText(theFile);
} 

