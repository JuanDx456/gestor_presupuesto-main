import * as gestionPresupuesto from '../js/gestionPresupuesto.js';
import * as generarDatosEstaticos from '../js/generarDatosEstaticos.js';

function fecha4y2m2d(hoy = new Date()) {

    let y = hoy.getFullYear() + "-";

    let mes = hoy.getMonth() + 1;
    let m = "";
    if (mes < 10) {
        m = "0" + mes;
    } else {
        m += mes;
    }
    m += "-"

    let d = "";
    if (hoy.getDate() < 10) {
        d = "0" + hoy.getDate();
    } else {
        d += hoy.getDate()
    }
    
    let fecha = y + m + d
    return fecha;
}

function mostrarDatoEnId(idElemento, valor) {
    if(idElemento != undefined) {
        let div = document.getElementById(idElemento);
        //let valor = valor.toFixed(2);
        div.innerHTML += "" + valor;
    }
}

function mostrarGastoWeb(idElemento, gasto) {
    if(idElemento != undefined){
        let br = document.createElement("br");
        let p = document.createElement("p");

        let div = document.getElementById(idElemento);
        div.append(p);
        let divgasto = document.createElement('div');
        divgasto.className = "gasto";

        let gastodes = document.createElement('div');
        gastodes.className = "gasto-descripcion";
        gastodes.innerHTML = gasto.descripcion;
        divgasto.append(gastodes);

        let gastofecha = document.createElement('div');
        gastofecha.className = "gasto-fecha";
        let fecha1 = new Date(gasto.fecha);
        let txtfecha = fecha1.toLocaleString();
        gastofecha.innerHTML = txtfecha;
        divgasto.append(gastofecha);

        let gastovalor = document.createElement('div');
        gastovalor.className = "gasto-valor";
        gastovalor.innerHTML = gasto.valor;
        divgasto.append(gastovalor);

        let gastoeti = document.createElement('div');
        gastoeti.className = "gasto-etiquetas";
        
        
        //if (gasto.etiquetas.length != undefined) {
        for (let i = 0; i < gasto.etiquetas.length; i++) {
            let eti = document.createElement('span');
            eti.className = "gasto-etiquetas-etiqueta";
            eti.innerHTML = gasto.etiquetas[i] + " ";

            let era = new BorrarEtiquetasHandle();
            era.gasto = gasto;
            era.etiqueta = gasto.etiquetas[i];

            eti.addEventListener("click", era)

            gastoeti.append(eti);
        }                       
        //}      

        divgasto.append(gastoeti);
        
        let editar = document.createElement('button');
        editar.className = "gasto-editar";
        editar.innerHTML = "Editar";

        let edit = new EditarHandle();
        edit.gasto = gasto;

        editar.addEventListener("click", edit);

        divgasto.append(editar);

        let borrar = document.createElement('button');
        borrar.className = "gasto-borrar";
        borrar.innerHTML = "Borrar";

        let eraser = new BorrarHandle();
        eraser.gasto = gasto;

        borrar.addEventListener("click", eraser);

        divgasto.append(borrar);

        let borrarAPI = document.createElement('button');
        borrarAPI.className = "gasto-borrar-api";
        borrarAPI.innerHTML = "Borrar (API)";
          

        let eraserAPI = new BorrarHandleAPI();
        eraserAPI.gasto = gasto;

        borrarAPI.addEventListener("click", eraserAPI);

        divgasto.append(borrarAPI);

        let editF = document.createElement('button');
        editF.className = "gasto-editar-formulario";
        editF.innerHTML = "Editar (formulario)";

        let editForm = new EditarHandleformulario();
        editForm.gasto = gasto;

        editF.addEventListener("click", editForm);

        divgasto.append(editF);

        divgasto.append(br);

        div.append(divgasto);    
        
        
    }

}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {

    var divP = document.getElementById(idElemento);
// Borrar el contenido de la capa para que no se duplique el contenido al repintar
    divP.innerHTML = "";

    let agrupacion = document.createElement('div');
    agrupacion.className = "agrupacion";

    let encabezado = document.createElement('h1');
    let claves = Object.keys(agrup);
    let long = claves.length;
    encabezado.innerHTML = "Gastos agrupados por " + periodo;
    
    agrupacion.append(encabezado);
    let valores = Object.values(agrup);

    for (let i = 0; i < long ; i++) {
        let agrupaciondato = document.createElement('div');
        agrupaciondato.className = "agrupacion-dato";

        let dataclave = document.createElement('span');
        dataclave.className = "agrupacion-dato-clave";    
        dataclave.innerHTML += claves[i];
        agrupaciondato.append(dataclave);

        let datavalor = document.createElement('span');
        datavalor.className = "agrupacion-dato-valor";
        datavalor.innerHTML += " | " + valores[i]; 
        agrupaciondato.append(datavalor); 

        agrupacion.append(agrupaciondato); 
    }

    

    divP.append(agrupacion);

    // Estilos
    divP.style.width = "33%";
    divP.style.display = "inline-block";
    // Crear elemento <canvas> necesario para crear la gráfica
    // https://www.chartjs.org/docs/latest/getting-started/
    let chart = document.createElement("canvas");
    // Variable para indicar a la gráfica el período temporal del eje X
    // En función de la variable "periodo" se creará la variable "unit" (anyo -> year; mes -> month; dia -> day)
    let unit = "";
    switch (periodo) {
    case "anyo":
        unit = "year";
        break;
    case "mes":
        unit = "month";
        break;
    case "dia":
    default:
        unit = "day";
        break;
    }

    // Creación de la gráfica
    // La función "Chart" está disponible porque hemos incluido las etiquetas <script> correspondientes en el fichero HTML
    const myChart = new Chart(chart.getContext("2d"), {
        // Tipo de gráfica: barras. Puedes cambiar el tipo si quieres hacer pruebas: https://www.chartjs.org/docs/latest/charts/line.html
        type: 'bar',
        data: {
            datasets: [
                {
                    // Título de la gráfica
                    label: `Gastos por ${periodo}`,
                    // Color de fondo
                    backgroundColor: "#555555",
                    // Datos de la gráfica
                    // "agrup" contiene los datos a representar. Es uno de los parámetros de la función "mostrarGastosAgrupadosWeb".
                    data: agrup
                }
            ],
        },
        options: {
            scales: {
                x: {
                    // El eje X es de tipo temporal
                    type: 'time',
                    time: {
                        // Indicamos la unidad correspondiente en función de si utilizamos días, meses o años
                        unit: unit
                    }
                },
                y: {
                    // Para que el eje Y empieza en 0
                    beginAtZero: true
                }
            }
        }
    });
    // Añadimos la gráfica a la capa
    divP.append(chart);
}

function repintar() {
    let div = document.getElementById("presupuesto");
    div.innerHTML = "";
    mostrarDatoEnId("presupuesto", gestionPresupuesto.mostrarPresupuesto());

    div = document.getElementById("gastos-totales");
    div.innerHTML = "";
    mostrarDatoEnId("gastos-totales", gestionPresupuesto.calcularTotalGastos());

    div = document.getElementById("balance-total");
    div.innerHTML = "";
    mostrarDatoEnId("balance-total", gestionPresupuesto.calcularBalance());

    div = document.getElementById("listado-gastos-completo"); 
    div.innerHTML = "";
    let listaGastos1 = gestionPresupuesto.listarGastos();
    for (let i = 0; i < listaGastos1.length; i++) {
        mostrarGastoWeb("listado-gastos-completo", listaGastos1[i]);
    }

    div = document.getElementById("agrupacion-dia");
    div.innerHTML = "";

    div = document.getElementById("agrupacion-mes");
    div.innerHTML = "";

    div = document.getElementById("agrupacion-anyo");
    div.innerHTML = "";

    mostrarGastosAgrupadosWeb("agrupacion-dia", gestionPresupuesto.agruparGastos("dia"), "día");
    mostrarGastosAgrupadosWeb("agrupacion-mes", gestionPresupuesto.agruparGastos("mes"), "mes");
    mostrarGastosAgrupadosWeb("agrupacion-anyo", gestionPresupuesto.agruparGastos("anyo"), "año");
}


function actualizarPresupuestoWeb() {
    let presupuesto = prompt("Introduce un presupuesto");
    let presupuesto_num;
    if (parseFloat(presupuesto)) {
        presupuesto_num = parseFloat(presupuesto);
    }
    gestionPresupuesto.actualizarPresupuesto(presupuesto_num);
    repintar();   
}

let boton_actualizar = document.getElementById("actualizarpresupuesto");
boton_actualizar.addEventListener("click", actualizarPresupuestoWeb);

function nuevoGastoWeb() {
    let descripcion = prompt("Introduce una descripción:");
    let valor = prompt("Introduce un valor:");
    let fecha = prompt("Introduce una fecha:", fecha4y2m2d());
    let etiquetas = prompt("Introduce las etiquetas:").split(",");

    valor = Number(valor);

    let newgasto = new gestionPresupuesto.CrearGasto(descripcion, valor, fecha, ...etiquetas);
    gestionPresupuesto.anyadirGasto(newgasto);

    repintar();
}

let boton_anyadirgasto = document.getElementById("anyadirgasto");
boton_anyadirgasto.addEventListener("click", nuevoGastoWeb);

function EditarHandle() {
    this.handleEvent = function() {
        let descripcion = prompt("Introduce una descripción:", this.gasto.descripcion);
        let valor = prompt("Introduce un valor:", this.gasto.valor);
        let fecha = new Date(this.gasto.fecha);
        fecha = prompt("Introduce una fecha:", fecha4y2m2d(fecha));
        let etis = "";

        valor = Number(valor);
        for (let i = 0; i < this.gasto.etiquetas.length; i++) {
            if (i < this.gasto.etiquetas.length - 1) {
                etis += this.gasto.etiquetas[i] + ",";
            } else {
                etis += this.gasto.etiquetas[i];
            }           
        };

        
        let etiquetas = prompt("Introduce las etiquetas:", etis);
        etiquetas = gestionPresupuesto.transformarListadoEtiquetas(etiquetas);
        this.gasto.actualizarDescripcion(descripcion);
        this.gasto.actualizarValor(valor);
        this.gasto.actualizarFecha(fecha);
        this.gasto.anyadirEtiquetas(...etiquetas);
        repintar();     
    }
     
}

function BorrarHandle() {
    this.handleEvent = function() {
        gestionPresupuesto.borrarGasto(this.gasto.id);
        repintar();     
    }    
}

function BorrarEtiquetasHandle() {
    this.handleEvent = function() {
        this.gasto.borrarEtiquetas(this.etiqueta);
        repintar();
    }    
}

function SubmitHandle() {
    this.handleEvent =  function(event) {
        event.preventDefault();
        let formsubmit = event.currentTarget;
        let newGasto = new gestionPresupuesto.CrearGasto(formsubmit.elements.descripcion.value, Number(formsubmit.elements.valor.value),
                                                        formsubmit.elements.fecha.value, ...formsubmit.elements.etiquetas.value.split(","));
        gestionPresupuesto.anyadirGasto(newGasto);    
        repintar();
        let btform = document.getElementById("anyadirgasto-formulario");
        btform.disabled = false;
    }   
}

function CancelHandle() {
    this.handleEvent =  function(event) {
        event.currentTarget.parentNode.remove();
        repintar();
        let btform = document.getElementById("anyadirgasto-formulario");
        btform.disabled = false;
    }   
}

function EditSubmit() {       
    this.handleEvent = function(event) {
        event.preventDefault();
        let formulario = event.currentTarget;
        this.gasto.actualizarDescripcion(formulario.elements.descripcion.value);
        this.gasto.actualizarValor(Number(formulario.elements.valor.value));
        this.gasto.actualizarFecha(formulario.elements.fecha.value);
        let etis = formulario.elements.etiquetas.value;
        etis = gestionPresupuesto.transformarListadoEtiquetas(etis)
        this.gasto.anyadirEtiquetas(...etis);
        repintar();
    }
}


function EditarAPIHandle() {
    this.handleEvent = function(event) {
        event.preventDefault();
        let user = document.getElementById("nombre_usuario").value;
        let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${user}/${this.gasto.gastoId}`;
        let formulario = event.currentTarget.form;

        let des = formulario.elements.descripcion.value;
        let val = Number(formulario.elements.valor.value);
        let fecha = formulario.elements.fecha.value;
        let etis = formulario.elements.etiquetas.value.split(",");

        let edit = {
            descripcion: des,
            valor: val,
            fecha: fecha,
            etiquetas: etis,
        };

        fetch(url, {
            method: "PUT",
            body: JSON.stringify(edit),
            headers:{
                'Content-Type': 'application/json'
            }       
        }).then(res => res.json())
        .then(()=>cargarGastosApibase())
        .catch(error => console.error('Error:', error));
       
    }
}


function EditarHandleformulario() {
    this.handleEvent =  function(event) {
        let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
        var formulario = plantillaFormulario.querySelector("form");

        let div = document.getElementById("controlesprincipales");
        div.append(formulario);

        let btEditform = event.currentTarget;
        btEditform.after(formulario);
        btEditform.disabled = true;

        formulario.elements.descripcion.value = this.gasto.descripcion;
        formulario.elements.valor.value = this.gasto.valor;
        let fecha = new Date(this.gasto.fecha);
        formulario.elements.fecha.value = fecha4y2m2d(fecha);

        let etis = "";
        for (let i = 0; i < this.gasto.etiquetas.length; i++) {
            if (i < this.gasto.etiquetas.length - 1) {
                etis += this.gasto.etiquetas[i] + ",";
            } else {
                etis += this.gasto.etiquetas[i];
            }           
        };

        formulario.elements.etiquetas.value = etis;

        let submit = new EditSubmit();
        submit.gasto = this.gasto;
        formulario.addEventListener("submit", submit); 


        let btedit_API = formulario.querySelector("button.gasto-enviar-api");
        let ediAPI = new EditarAPIHandle();
        ediAPI.gasto = this.gasto;
        btedit_API.addEventListener("click", ediAPI);


        let bt_cancelar = formulario.querySelector("button.cancelar");  
        let objCancel = new CancelHandle();
        bt_cancelar.addEventListener("click", objCancel);

        
    }  
}

/*
async function SubmitAPIHandle(event) {
    
        event.preventDefault();
        let formulario = event.currentTarget;

        let user = document.getElementById("nombre_usuario").value;
        let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${user}`;

        formulario.action = url;

        let datos = new FormData(formulario);

        let init = {
            method: formulario.method,
            body: datos
        };

        try {
            var response = await fetch(formulario.action, init);
            if (response.ok) {
                var respuesta = await response.json();
                //cargarGastosApi();
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            console.log("error");
        }
        
      
}
*/


function SubmitAPIHandle() {
    this.handleEvent =  function(event) {
        event.preventDefault();
        let formulario = event.currentTarget.form;

        let user = document.getElementById("nombre_usuario").value;
        let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${user}`;

        
        let des = formulario.elements.descripcion.value;
        let valor = formulario.elements.valor.value;
        let fecha = formulario.elements.fecha.value;
        let etis = formulario.elements.etiquetas.value.split(",");
             
        /*
        try{
            let rawResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    descripcion: des,
                    valor: valor,
                    fecha: fecha,
                    etiquetas: etis
                })
            });
            const content = await rawResponse.json();
            console.log(content);
        }
        catch(error){
            console.log(error.message);
        }
        */

        /*
        fetch(url, {
            method: 'POST',
            headers: {
                //'Accept': 'application/json, text/plain,',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                descripcion: des,
                valor: valor,
                fecha: fecha,
                etiquetas: etis
            })
        }).then(res => res.JSON())
        .then(res => console.log(res));
        */

        /*
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        let body = JSON.stringify({
            descripcion: des,
            valor: valor,
            fecha: fecha,
            etiquetas: etis,
        });

        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 201) {
                console.log(JSON.parse(xhr.responseText));
                cargarGastosApi();
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };

        xhr.send(body);

        */

        
        let gasto = {
            descripcion: des,
            valor: valor,
            fecha: fecha,
            etiquetas: etis,
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify(gasto),
            headers:{
                'Content-Type': 'application/json'
            }       
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(()=>cargarGastosApibase());

        

        /*
        .then(response => response.json())
        .then(data => {
            console.log(data);
            cargarGastosApi();         
        })
        .catch(err => console.log(err));
        */

        let btform = document.getElementById("anyadirgasto-formulario");
        btform.disabled = false;
    }   
}


function nuevoGastoWebFormulario() {
    let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
    var formulario = plantillaFormulario.querySelector("form");

    let div = document.getElementById("controlesprincipales");
    div.append(formulario);

    let submit = new SubmitHandle();

    formulario.addEventListener("submit", submit);  

    let bt_cancelar = formulario.querySelector("button.cancelar");  
    let objCancel = new CancelHandle();
    bt_cancelar.addEventListener("click", objCancel);

    let bt_API = formulario.querySelector("button.gasto-enviar-api");
    let objAPI = new SubmitAPIHandle();
    bt_API.addEventListener("click", objAPI);

    let btform = document.getElementById("anyadirgasto-formulario");
    btform.disabled = true;

}

let bt_anyadir_gastoForm = document.getElementById("anyadirgasto-formulario");
bt_anyadir_gastoForm.addEventListener("click", nuevoGastoWebFormulario);

function filtrarGastosWeb() {
    this.handleEvent = function (event) {
        event.preventDefault();
        let des = this.form.elements["formulario-filtrado-descripcion"].value;
        let valormin = this.form.elements["formulario-filtrado-valor-minimo"].value;
        valormin = Number(valormin);
        let valormax = this.form.elements["formulario-filtrado-valor-maximo"].value;
        valormax = Number(valormax);
        let fechadesde = this.form.elements["formulario-filtrado-fecha-desde"].value;
        let fechahasta = this.form.elements["formulario-filtrado-fecha-hasta"].value;
        let etis = this.form.elements["formulario-filtrado-etiquetas-tiene"].value;
        etis = gestionPresupuesto.transformarListadoEtiquetas(etis);

        let arrayfil = gestionPresupuesto.filtrarGastos({fechaDesde: fechadesde, fechaHasta: fechahasta, valorMinimo: valormin,
                                                        valorMaximo: valormax, descripcionContiene: des, etiquetasTiene: etis});
                                  
        document.getElementById("listado-gastos-completo").innerHTML = "";
                                                        
        for (let i = 0; i < arrayfil.length; i++) {
            mostrarGastoWeb("listado-gastos-completo", arrayfil[i]);
        }
    }   
}

let filtrarform = document.getElementById("formulario-filtrado");
let objFiltrar = new filtrarGastosWeb();
objFiltrar.form = filtrarform;
filtrarform.addEventListener("submit", objFiltrar);


function guardarGastosWeb() {
    localStorage.GestorGastosDWEC = JSON.stringify(gestionPresupuesto.listarGastos());
    //localStorage.GestorGastosDWEC = undefined;
}

let btguardar = document.getElementById("guardar-gastos");
btguardar.addEventListener("click", guardarGastosWeb);

function cargarGastosWeb() {
    let arr = new Array();
    if (localStorage.GestorGastosDWEC != null) {
        arr = localStorage.GestorGastosDWEC;
        arr = JSON.parse(arr);
    } else {
        gestionPresupuesto.cargarGastos([]);
    }
    gestionPresupuesto.anyadirGasto(...arr);
    repintar();
}

let btcargar = document.getElementById("cargar-gastos");
btcargar.addEventListener("click", cargarGastosWeb);

async function cargarGastosApibase() {
    let user = document.getElementById("nombre_usuario").value;
    let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${user}`;

    fetch (url, {method: "GET"})
    .then(response => response.json())
    .then(arr => {
        console.log(arr);
        gestionPresupuesto.cargarGastos(arr);
        repintar();
    })
    .catch(error => console.error('Error:', error));
}

function cargarGastosApi() {
    this.handleEvent = function (event) {
        event.preventDefault();
        cargarGastosApibase();
    }  
}

let btcargarAPI = document.getElementById("cargar-gastos-api");
btcargarAPI.addEventListener("click", new cargarGastosApi());

function BorrarHandleAPI() {
    this.handleEvent = function () {
        let user = document.getElementById("nombre_usuario").value;
        let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${user}/${this.gasto.gastoId}`;

        fetch (url, {method: "DELETE"})
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(()=>cargarGastosApibase());
    }
} 

export   {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
    filtrarGastosWeb
}