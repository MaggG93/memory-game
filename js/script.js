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

// Función para crear las cartas y el tablero:
function crearCartas(tamano) {
  cartas = [];
  const totalCartas = tamano * tamano; // Determina cuántas cartas habrá según el tamaño seleccionado
  const pares = [...imagenes, ...imagenes].slice(0, totalCartas / 2); // Crea pares de cartas con las imágenes
  const mezcladas = [...pares, ...pares].sort(() => Math.random() - 0.5); // Mezcla las cartas aleatoriamente

  juego.innerHTML = "";
  juego.style.gridTemplateColumns = `repeat(${tamano}, 1fr)`; // Configura la cantidad de columnas

  // Crea cada carta en el DOM y agrega el evento de voltear:
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

    carta.addEventListener("click", () => voltearCarta(carta)); // Evento para voltear la carta al hacer clic
    cartas.push(carta);
    juego.appendChild(carta);
  });
}

// Función para manejar el volteo de cartas:
function voltearCarta(carta) {
  // Evita que se volteen cartas ya volteadas o si ya hay una segunda carta seleccionada:
  if (carta.classList.contains("volteada") || segundaCarta) return;

  carta.classList.add("volteada"); // Voltea la carta

  // Si no hay una carta seleccionada, selecciona la primera carta:
  if (!primeraCarta) {
    primeraCarta = carta;
  } else {
    // Si ya hay una primera carta, selecciona la segunda y verifica si forman una pareja:
    segundaCarta = carta;
    verificarPareja();
  }
}

// Función para verificar si las dos cartas seleccionadas son iguales:
function verificarPareja() {
  movimientos++; // Aumenta el contador de movimientos
  movimientosSpan.textContent = movimientos;

  if (primeraCarta.dataset.name === segundaCarta.dataset.name) {
    parejasEncontradas++; // Si son iguales, aumenta el contador de parejas encontradas
    resetearCartas();

    // Si se han encontrado todas las parejas, finaliza el juego:
    if (parejasEncontradas === cartas.length / 2) {
      clearInterval(temporizador);
      alert(`¡Has ganado en ${movimientos} movimientos y ${tiempo} segundos!`);
    }
  } else {
    // Si las cartas no coinciden, vuelve a voltearlas:
    setTimeout(() => {
      primeraCarta.classList.remove("volteada");
      segundaCarta.classList.remove("volteada");
      resetearCartas();
    }, 1000);
  }
}

// Función para resetear las cartas seleccionadas:
function resetearCartas() {
  primeraCarta = null;
  segundaCarta = null;
}

// Función para reiniciar el juego:
function reiniciarJuego() {
  movimientos = 0;
  tiempo = 0;
  parejasEncontradas = 0;
  movimientosSpan.textContent = movimientos;
  tiempoSpan.textContent = tiempo;

  clearInterval(temporizador); // Elimina el temporizador anterior

  temporizador = setInterval(() => {
    tiempo++;
    tiempoSpan.textContent = tiempo;

    // Imagen temporal al alcanzar ciertos tiempos:
    if (tiempo === 30) {
      const imagen_temporal = document.createElement("img");
      imagen_temporal.src = "src/img12.gif";
      imagen_temporal.alt = "Imagen temporal";
      imagen_temporal.classList.add("imagen-temporal");
      controles.appendChild(imagen_temporal);
    } else if (tiempo === 60) {
      const imagen_temporal = document.querySelector(".imagen-temporal");
      imagen_temporal.remove();
      const nuevaImagen = document.createElement("img");
      nuevaImagen.src = "src/img14.gif";
      nuevaImagen.alt = "Imagen temporal";
      nuevaImagen.classList.add("imagen-temporal");
      controles.appendChild(nuevaImagen);
    }
  }, 1000);

  const reiniciar_imagen_temporal = document.querySelector(".imagen-temporal");
  if (reiniciar_imagen_temporal) {
    reiniciar_imagen_temporal.remove();
  }

  const tamano = parseInt(tamanoSelect.value);
  crearCartas(tamano);
}

reiniciarBtn.addEventListener("click", reiniciarJuego); // Reinicia el juego
tamanoSelect.addEventListener("change", reiniciarJuego); // Cambia el tamaño del tablero

reiniciarJuego(); // Función de reinicio al cargar la página
