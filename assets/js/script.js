// Variables
let btnBuscar = document.querySelector("#buscar");
let resultado = document.getElementById("resultado");
let pesos = document.querySelector("#pesos-clp");
let divisa = document.querySelector("#convertir-moneda");

// Botón buscar
btnBuscar.addEventListener("click", async () => {
    if(pesos.value == "") {
        alert("Ingrese el monto en CLP")
    } else {
        await conversion();
        graficoRenderizado();
    }
});

// Función que llama a la API localmente
async function getMonedas() {
    try {
        const res = await fetch("assets/json/valor-moneda.json");
        const arrayData = await res.json();

        return arrayData;
    } catch(a) {
        alert(a.message);
    }
}

// Función para llenar los select en el HTML
async function selectMonedas() {
    const arrayData = await getMonedas();
    let divisas = document.querySelector("#convertir-moneda");

    let html = "";
    for(moneda of arrayData) {
        html += `<option value="${moneda.Codigo}">${moneda.Nombre}</option>`;       
    }
    divisas.innerHTML = html;
}
selectMonedas();

// Función que realiza la conversión
async function conversion() {
    const arrayData = await getMonedas();
    const monedaFiltro = arrayData.filter((b) => b.Codigo == divisa.value);
    const monedaSimbolo = monedaFiltro.map((b) => b.Simbolo);
    const valor = monedaFiltro.map((b) => b.Valor);
    let convertir = +pesos.value / +valor;
    resultado.innerHTML = `${monedaSimbolo} ${convertir.toFixed(3)}`;
}

// Gráfico
function elementosGrafico(M) {
    const tituloGrafico = "Monedas";
    const monedaFiltro = M.filter((b) => b.Codigo == divisa.value); 
    const valores = monedaFiltro.map((moneda) => moneda.Valor );

    const configGrafico = {
        type: "line",
        data: {
          labels: ["2018", "2019", "2020", "2021", "2022"],
          datasets: [
            {
              label: tituloGrafico,
              backgroundColor: "blue",
              data:  [+(valores *0.8).toFixed(2),
              +(valores *0.6).toFixed(2),
              +(valores *0.7).toFixed(2),
              +(valores *0.5).toFixed(2),
              +(valores *0.9).toFixed(2)],
              pointBackgroundColor: "white",
              fill: false,
              borderColor: "rgb(0, 213, 255)",
            },
          ],
        }, 
      };
      return configGrafico;
}

// Función para mostrar el gráfico en el HTML
async function graficoRenderizado() {
  const M = await getMonedas();
  const configGrafico = elementosGrafico(M);
  const graficoMonedas = document.getElementById("grafico-monedas").getContext('2d');
  new Chart(graficoMonedas, configGrafico);
}
