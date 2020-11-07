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
            return alert("la peticon fallo con exito!");
        })
        .then(data =>{
            //console.log(data)
            txtjavascript = document.getElementById("txt");
            let saludo = data;
            //console.log(saludo.translation)
            txtjavascript.value = saludo.translation;
            // texto = document.getElementById("txt").value + '\n***';
            // txtjavascript.value = texto;
            getComentarios();
        }) 
    }
    else{
        alert("Ninguna intacia selecionada");
    }
}

function getComentarios()
{
    var url = 'http://localhost:3000/comentarios';
    /*
    *verificar que se ha selecinado una tab desde el html para analizar
    */
    if(editor){
        fetch(url,{
            method: 'GET',
        })
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            //console.log(data);
            var area = document.getElementById('txt');
            texto = document.getElementById("txt").value;
            for(i=0;i<data.length;i++)
            {
                texto = texto + '\n'+data[i]+'\n';
            }
            area.value = texto;
        })
        .catch(error =>{
            return alert("Error en la data del arbol")
        })
    }
    else{
        alert("Ninguna intacia selecionada");
    }
}


/**
 * envio de informacion para el analizador de python
 */
function setInfoPython(editor){
    var url2 = 'http://localhost:3500/analizar';
    var texto = 'public class animal{int var1=45;}';    
    /*
    *verificar que se ha selecinado una tab desde el html para analizar
    */
    if(editor){
        console.log("**************************************");
        console.log("Se encontro una instacia para analizar");
        texto = editor.getValue();
        //console.log(texto)
        fetch(url2,{
            method: 'POST',
            body: JSON.stringify({"codigo":texto}),
            headers: {"Content-Type":"application/json"}
        })
        .then(response => {
            //console.log(response);
            return response.json()
        })
        .catch(error => {
            return alert("la peticon fallo con exito!");
        })
        .then(data =>{
            //console.log(data)
            txtjavascript = document.getElementById("txtpython");
            let saludo = data;
            //console.log(saludo.translation)
            txtjavascript.value = saludo.translation;
        }) 
    }
    else{
        alert("Ninguna intacia selecionada");
    }
}


/**
 * consulta para el listado de tokens
 */
function getTokens(){
    var url = 'http://localhost:3000/listadoTokens';    
    fetch(url,{
        method: 'GET',
    })
    .then(response => {
        console.log(response);
        return response.json();
    })
    .then(data => {
        console.log(data)
    })
    .catch(error =>{
        return alert("Error en ele listado de tokens")
    })
}

/**
 * modal para ver los reportes de una forma grafica - TABLA DE LISTADO DE TOKENS JISON
 */
function tablaReportes(){
    var divContenedor = document.createElement("div");
    divContenedor.className = "divContenedorTokens";
    divContenedor.id = "divContenedorTokens";
    //boton para eleminar la ventana emergente
    var closeDiv = document.createElement("button");
    closeDiv.className = "close";
    closeDiv.id = "close";
    closeDiv.innerHTML = "X";
    closeDiv.onclick = function() {
        var divContenedor = document.getElementById("divContenedorTokens");
        document.body.removeChild(divContenedor);
    };
    divContenedor.appendChild(closeDiv)    
    //tabla de contenido
    var tablaTokens = document.createElement("table");
    tablaTokens.className = "table";
    var encabezado = document.createElement("thead");
    var contenido = document.createElement("tr");
    var fila = document.createElement("th");
    fila.innerHTML= "FILA";
    var columna = document.createElement("th");
    columna.innerHTML= "COLUMNA";
    var tipo = document.createElement("th");
    tipo.innerHTML= "TIPO";
    var token = document.createElement("th");
    token.innerHTML= "TOKEN";
    tablaTokens.appendChild(encabezado);
    encabezado.appendChild(contenido)
    contenido.appendChild(fila);
    contenido.appendChild(columna);
    contenido.appendChild(tipo);
    contenido.appendChild(token);

    /*
    *contenido interno de la tabla
    */
    var url = 'http://localhost:3000/listadoTokens';
    fetch(url,{
        method: 'GET',
    })
    .then(response => {
        //console.log(response);
        return response.json();
    })
    .then(data => {
        //console.log(data);
        for(var i in data){
            let fila = document.createElement("tr");
            let elemento1 = document.createElement("td");
            elemento1.innerText = data[i].Fila;
            let elemento2 = document.createElement("td");
            elemento2.innerText = data[i].Columna;
            let elemento3 = document.createElement("td");
            elemento3.innerText = data[i].Tipo;
            let elemento4 = document.createElement("td");
            elemento4.innerText = data[i].Token;
            fila.appendChild(elemento1);
            fila.appendChild(elemento2);
            fila.appendChild(elemento3);
            fila.appendChild(elemento4);
            tablaTokens.appendChild(fila);
        }
    })
    .catch(error =>{
        return alert("Error en ele listado de tokens")
    })

    //
    divContenedor.appendChild(tablaTokens);
    //agregacion
    document.body.appendChild(divContenedor);
}


/**
 * modal para ver los reportes de una forma grafica - TABLA DE LISTADO DE TOKENS PYTHON
 */
function tablaReportesPython(){
    var divContenedor = document.createElement("div");
    divContenedor.className = "divContenedorTokens";
    divContenedor.id = "divContenedorTokens";
    //boton para eleminar la ventana emergente
    var closeDiv = document.createElement("button");
    closeDiv.className = "close";
    closeDiv.id = "close";
    closeDiv.innerHTML = "X";
    closeDiv.onclick = function() {
        var divContenedor = document.getElementById("divContenedorTokens");
        document.body.removeChild(divContenedor);
    };
    divContenedor.appendChild(closeDiv)    
    //tabla de contenido
    var tablaTokens = document.createElement("table");
    tablaTokens.className = "table";
    var encabezado = document.createElement("thead");
    var contenido = document.createElement("tr");
    var fila = document.createElement("th");
    fila.innerHTML= "FILA";
    var columna = document.createElement("th");
    columna.innerHTML= "COLUMNA";
    var tipo = document.createElement("th");
    tipo.innerHTML= "TIPO";
    var token = document.createElement("th");
    token.innerHTML= "TOKEN";
    tablaTokens.appendChild(encabezado);
    encabezado.appendChild(contenido)
    contenido.appendChild(fila);
    contenido.appendChild(columna);
    contenido.appendChild(tipo);
    contenido.appendChild(token);

    /*
    *contenido interno de la tabla
    */
    var url2 = 'http://localhost:3500/listadoTokens';
    fetch(url2,{
        method: 'GET',
    })
    .then(response => {
        //console.log(response);
        return response.json();
    })
    .then(data => {
        //console.log(data);
        for(var i in data){
            let fila = document.createElement("tr");
            let elemento1 = document.createElement("td");
            elemento1.innerText = data[i].Fila;
            let elemento2 = document.createElement("td");
            elemento2.innerText = data[i].Columna;
            let elemento3 = document.createElement("td");
            elemento3.innerText = data[i].Tipo;
            let elemento4 = document.createElement("td");
            elemento4.innerText = data[i].Token;
            fila.appendChild(elemento1);
            fila.appendChild(elemento2);
            fila.appendChild(elemento3);
            fila.appendChild(elemento4);
            tablaTokens.appendChild(fila);
        }
    })
    .catch(error =>{
        return alert("Error en ele listado de tokens")
    })

    //
    divContenedor.appendChild(tablaTokens);
    //agregacion
    document.body.appendChild(divContenedor);
}


/*
*funcion para retornar erroes obtenidos
*/
function tablaErrores(){
    var divContenedor = document.createElement("div");
    divContenedor.className = "divContenedorTokens";
    divContenedor.id = "divContenedorTokens";
    //boton para eleminar la ventana emergente
    var closeDiv = document.createElement("button");
    closeDiv.className = "close";
    closeDiv.id = "close";
    closeDiv.innerHTML = "X";
    closeDiv.onclick = function() {
        var divContenedor = document.getElementById("divContenedorTokens");
        document.body.removeChild(divContenedor);
    };
    divContenedor.appendChild(closeDiv)    
    //tabla de contenido
    let tablaTokens = document.createElement("table");
    tablaTokens.className = "table";
    //titulos
    let encabezado = document.createElement("thead");
    let contenido = document.createElement("tr");
    let tipo = document.createElement("th");
    tipo.innerHTML= "TIPO";
    let fila = document.createElement("th");
    fila.innerHTML= "FILA";
    let columna = document.createElement("th");
    columna.innerHTML= "COLUMNA";
    let des = document.createElement("th");
    des.innerHTML= "DESCRIPCION";
    //
    tablaTokens.appendChild(encabezado);
    encabezado.appendChild(contenido)
    contenido.appendChild(tipo);
    contenido.appendChild(fila);
    contenido.appendChild(columna);
    contenido.appendChild(des);
    //
    /*
    *contenido interno de la tabla
    */
    var url = 'http://localhost:3000/listadoErrores';
    fetch(url,{
        method: 'GET',
    })
    .then(response => {
        //console.log(response);
        return response.json();
    })
    .then(data => {
        console.log(data);
        for(var i in data){
            let fila = document.createElement("tr");
            //
            let elemento1 = document.createElement("td");
            elemento1.innerText = data[i].Tipo;
            let elemento2 = document.createElement("td");
            elemento2.innerText = data[i].Fila;
            let elemento3 = document.createElement("td");
            elemento3.innerText = data[i].Columna;
            let elemento4 = document.createElement("td");
            elemento4.innerText = data[i].Descripcion;
            //
            fila.appendChild(elemento1);
            fila.appendChild(elemento2);
            fila.appendChild(elemento3);
            fila.appendChild(elemento4);
            //
            tablaTokens.appendChild(fila);
        }
    })
    .catch(error =>{
        return alert("Error Reporte Errores!")
    })
    //
    divContenedor.appendChild(tablaTokens);
    //agregacion
    document.body.appendChild(divContenedor);
}


/*
*           PYTHON
*funcion para retornar erroes obtenidos del analizador de python
*/
function tablaErroresPython(){
    var divContenedor = document.createElement("div");
    divContenedor.className = "divContenedorTokens";
    divContenedor.id = "divContenedorTokens";
    //boton para eleminar la ventana emergente
    var closeDiv = document.createElement("button");
    closeDiv.className = "close";
    closeDiv.id = "close";
    closeDiv.innerHTML = "X";
    closeDiv.onclick = function() {
        var divContenedor = document.getElementById("divContenedorTokens");
        document.body.removeChild(divContenedor);
    };
    divContenedor.appendChild(closeDiv)    
    //tabla de contenido
    let tablaTokens = document.createElement("table");
    tablaTokens.className = "table";
    //titulos
    let encabezado = document.createElement("thead");
    let contenido = document.createElement("tr");
    let tipo = document.createElement("th");
    tipo.innerHTML= "TIPO";
    let fila = document.createElement("th");
    fila.innerHTML= "FILA";
    let columna = document.createElement("th");
    columna.innerHTML= "COLUMNA";
    let des = document.createElement("th");
    des.innerHTML= "DESCRIPCION";
    //
    tablaTokens.appendChild(encabezado);
    encabezado.appendChild(contenido)
    contenido.appendChild(tipo);
    contenido.appendChild(fila);
    contenido.appendChild(columna);
    contenido.appendChild(des);
    //
    /*
    *contenido interno de la tabla
    */
    var url = 'http://localhost:3500/listadoErrores';
    fetch(url,{
        method: 'GET',
    })
    .then(response => {
        //console.log(response);
        return response.json();
    })
    .then(data => {
        console.log(data);
        for(var i in data){
            let fila = document.createElement("tr");
            //
            let elemento1 = document.createElement("td");
            elemento1.innerText = data[i].Tipo;
            let elemento2 = document.createElement("td");
            elemento2.innerText = data[i].Fila;
            let elemento3 = document.createElement("td");
            elemento3.innerText = data[i].Columna;
            let elemento4 = document.createElement("td");
            elemento4.innerText = data[i].Descripcion;
            //
            fila.appendChild(elemento1);
            fila.appendChild(elemento2);
            fila.appendChild(elemento3);
            fila.appendChild(elemento4);
            //
            tablaTokens.appendChild(fila);
        }
    })
    .catch(error =>{
        return alert("Error Reporte Errores!")
    })
    //
    divContenedor.appendChild(tablaTokens);
    //agregacion
    document.body.appendChild(divContenedor);
}


/*
*funcion para graficar el arbol
*/
function tree(){
    //var datos={"name":"INCIO","children":[{"name":"CLASE","children":[{"name":"public"},{"name":"class"},{"name":"Animal"},{"name":"{"},{"name":"}"}]}]};
    var divContenedor = document.createElement("div");
    divContenedor.className = "divContenedorTokens";
    divContenedor.id = "divContenedorTokens";
    //boton para eleminar la ventana emergente
    var closeDiv = document.createElement("button");
    closeDiv.className = "close";
    closeDiv.id = "close";
    closeDiv.innerHTML = "X";
    closeDiv.onclick = function() {
        var divContenedor = document.getElementById("divContenedorTokens");
        document.body.removeChild(divContenedor);
    };
    //
    var tree = document.createElement("div");
    tree.id = "tree";
    tree.className = "tree"
    //
    divContenedor.appendChild(closeDiv);
    divContenedor.appendChild(tree);
    //    
    //agregacion
    document.body.appendChild(divContenedor);
    //btAnalizar(datos);
    //
    /*
    *contenido interno de la tabla
    */
    var url = 'http://localhost:3000/dataTree';
    fetch(url,{
        method: 'GET',
    })
    .then(response => {
        console.log(response);
        return response.json();
    })
    .then(data => {
        //console.log(data);
        // jsonData = JSON.stringify(data);
        // console.log(jsonData);
        // BuildVerticaLTree(jsonData,"#tree");
        btAnalizar(data);
    })
    .catch(error =>{
        return alert("Error en la data del arbol")
    })
}



function btAnalizar(data) {
	function BuildVerticaLTree(treeData, treeContainerDom) {
		var margin = { top: 40, right: 120, bottom: 20, left: 120 };
		var width = 960 - margin.right - margin.left;
		var height = 500 - margin.top - margin.bottom;

		var i = 0, duration = 750;
		var tree = d3.layout.tree()
			.size([height, width]);
		var diagonal = d3.svg.diagonal()
			.projection(function (d) { return [d.x, d.y]; });
		var svg = d3.select(treeContainerDom).append("svg")
			.attr("width", 5000)
			.attr("height", 5000)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		root = treeData;

		update(root);
		function update(source) {
			// Compute the new tree layout.
			var nodes = tree.nodes(root).reverse(),
				links = tree.links(nodes);
			// Normalize for fixed-depth.
			nodes.forEach(function (d) { d.y = d.depth * 100; });
			// Declare the nodes…
			var node = svg.selectAll("g.node")
				.data(nodes, function (d) { return d.id || (d.id = ++i); });
			// Enter the nodes.
			var nodeEnter = node.enter().append("g")
				.attr("class", "node")
				.attr("transform", function (d) {
					return "translate(" + source.x0 + "," + source.y0 + ")";
				}).on("click", nodeclick);
			nodeEnter.append("circle")
				.attr("r", 10)
				.attr("stroke", function (d) { return d.children || d._children ? "steelblue" : "#00c13f"; })
				.style("fill", function (d) { return d.children || d._children ? "lightsteelblue" : "#fff"; });
			//.attr("r", 10)
			//.style("fill", "#fff");
			nodeEnter.append("text")
				.attr("y", function (d) {
					return d.children || d._children ? -18 : 18;
				})
				.attr("dy", ".35em")
				.attr("text-anchor", "middle")
				.text(function (d) { return d.name; })
				.style("fill-opacity", 1e-6);
			// Transition nodes to their new position.
			//horizontal tree
			var nodeUpdate = node.transition()
				.duration(duration)
				.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
			nodeUpdate.select("circle")
				.attr("r", 10)
				.style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });
			nodeUpdate.select("text")
				.style("fill-opacity", 1);


			// Transition exiting nodes to the parent's new position.
			var nodeExit = node.exit().transition()
				.duration(duration)
				.attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
				.remove();
			nodeExit.select("circle")
				.attr("r", 1e-6);
			nodeExit.select("text")
				.style("fill-opacity", 1e-6);
			// Update the links…
			// Declare the links…
			var link = svg.selectAll("path.link")
				.data(links, function (d) { return d.target.id; });
			// Enter the links.
			link.enter().insert("path", "g")
				.attr("class", "link")

				.attr("d", function (d) {
					var o = { x: source.x0, y: source.y0 };
					return diagonal({ source: o, target: o });
				});
			// Transition links to their new position.
			link.transition()
				.duration(duration)
				.attr("d", diagonal);


			// Transition exiting nodes to the parent's new position.
			link.exit().transition()
				.duration(duration)
				.attr("d", function (d) {
					var o = { x: source.x, y: source.y };
					return diagonal({ source: o, target: o });
				})
				.remove();

			// Stash the old positions for transition.
			nodes.forEach(function (d) {
				d.x0 = d.x;
				d.y0 = d.y;
			});
		}

		// Toggle children on click.
		function nodeclick(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
			}
			update(d);
		}
	}

	//var cod = document.getElementById('taCodigo');

	var treeData = data;
	console.log(treeData);

	BuildVerticaLTree(treeData, document.getElementById("tree"));

}




