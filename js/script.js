"use strict";

// Imágenes de las cartas:
const imagenes = [
  "src/img1.gif",
  "src/img2.gif",
  "src/img3.gif",
  "src/img4.gif",
  "src/img5.gif",
  "src/img6.gif",
  "src/img7.gif",
  "src/img8.gif",
  "src/img9.gif",
  "src/img10.gif",
  "src/img11.gif",
  "src/img12.gif",
  "src/img13.gif",
  "src/img14.gif",
  "src/img15.gif",
  "src/img16.gif",
  "src/img17.gif",
  "src/img18.gif",
];

// Elementos del DOM:
const juego = document.getElementById("juego");
const movimientosSpan = document.getElementById("movimientos");
const controles = document.getElementById("controles");
const tiempoSpan = document.getElementById("tiempo");
const reiniciarBtn = document.getElementById("reiniciar");
const tamanoSelect = document.getElementById("tamano");

let cartas = [];
let primeraCarta = null;
let segundaCarta = null;
let movimientos = 0;
let tiempo = 0;
let temporizador = null;
let parejasEncontradas = 0;

// Funciones:
function crearCartas(tamano) {
  cartas = [];
  const totalCartas = tamano * tamano; // Número total de cartas en la cuadrícula
  const pares = [...imagenes, ...imagenes].slice(0, totalCartas / 2); // Ajustar imágenes según el tamaño
  const mezcladas = [...pares, ...pares].sort(() => Math.random() - 0.5);

  juego.innerHTML = "";
  juego.style.gridTemplateColumns = `repeat(${tamano}, 1fr)`;

  mezcladas.forEach((src) => {
    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.dataset.name = src;

    carta.innerHTML = `
      <div class="carta-inner">
        <div class="carta-front" style="background-image: url('${src}')"></div>
        <div class="carta-back"></div>
      </div>
    `;

    carta.addEventListener("click", () => voltearCarta(carta));
    cartas.push(carta);
    juego.appendChild(carta);
  });
}

function voltearCarta(carta) {
  if (carta.classList.contains("volteada") || segundaCarta) return;

  carta.classList.add("volteada");

  if (!primeraCarta) {
    primeraCarta = carta;
  } else {
    segundaCarta = carta;
    verificarPareja();
  }
}

function verificarPareja() {
  movimientos++;
  movimientosSpan.textContent = movimientos;

  if (primeraCarta.dataset.name === segundaCarta.dataset.name) {
    parejasEncontradas++;
    resetearCartas();

    if (parejasEncontradas === cartas.length / 2) {
      clearInterval(temporizador);
      alert(`¡Has ganado en ${movimientos} movimientos y ${tiempo} segundos!`);
    }
  } else {
    setTimeout(() => {
      primeraCarta.classList.remove("volteada");
      segundaCarta.classList.remove("volteada");
      resetearCartas();
    }, 1000);
  }
}

function resetearCartas() {
  primeraCarta = null;
  segundaCarta = null;
}

function reiniciarJuego() {
  movimientos = 0;
  tiempo = 0;
  parejasEncontradas = 0;
  movimientosSpan.textContent = movimientos;
  tiempoSpan.textContent = tiempo;
  let imagen_temporal;

  clearInterval(temporizador);

  temporizador = setInterval(() => {
    tiempo++;
    tiempoSpan.textContent = tiempo;

    if (tiempo === 10) {
      imagen_temporal = document.createElement("img");
      imagen_temporal.src = "src/img12.gif";
      imagen_temporal.alt = "Imagen temporal";
      imagen_temporal.classList.add("imagen-temporal");
      controles.appendChild(imagen_temporal);
    } else if (tiempo === 15) {
      imagen_temporal = document.querySelector(".imagen-temporal");
      imagen_temporal.remove();
      imagen_temporal = document.createElement("img");
      imagen_temporal.src = "src/img14.gif";
      imagen_temporal.alt = "Imagen temporal";
      imagen_temporal.classList.add("imagen-temporal");
      controles.appendChild(imagen_temporal);
    }
  }, 1000);

  const reiniciar_imagen_temporal = document.querySelector(".imagen-temporal");
  if (reiniciar_imagen_temporal) {
    reiniciar_imagen_temporal.remove();
  }
  
  const tamano = parseInt(tamanoSelect.value);
  crearCartas(tamano);
}

// Eventos:
reiniciarBtn.addEventListener("click", reiniciarJuego);
tamanoSelect.addEventListener("change", reiniciarJuego);

// Inicialización
reiniciarJuego();
