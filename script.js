// script.js
document.addEventListener('DOMContentLoaded', () => {
    const wordContainer = document.getElementById('word-container');
    const inputField = document.getElementById('input-field');
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const levelElement = document.getElementById('level');
    const pauseBtn = document.getElementById('pause-btn');
    const restartBtn = document.getElementById('restart-btn');

    const palabrasNivel1 = ["gato", "perro", "casa", "sol", "luna", "estrella", "nube", "cielo", "mar", "arroz"];
    const palabrasNivel3 = ["árbol", "garantizar", "escuchar", "laboratorio", "rápido", "revoluciones", "mamá", "papá", "sofá", "camiones"];
    
    let palabras = [...palabrasNivel1];
    let velocidad = 0.3; // Reducimos la velocidad inicial
    let intervalo = 4000;
    let puntuacion = 0;
    let vidas = 3;
    let nivel = 1;
    let paused = false;
    let intervalId;
    let timeLeft = 2000; // Tiempo límite en segundos
    let timeIntervalId;

    function crearPalabra() {
        if (!paused) {
            const palabra = document.createElement('div');
            palabra.classList.add('word');
            palabra.textContent = palabras[Math.floor(Math.random() * palabras.length)];
            palabra.style.top = '0px';
            palabra.style.left = Math.random() * (wordContainer.clientWidth - 100) + 'px';
            palabra.dataset.velocityY = 0; // Velocidad inicial en el eje Y
            wordContainer.appendChild(palabra);
        }
    }

    function moverPalabras() {
        if (!paused) {
            const palabras = document.querySelectorAll('.word');
            palabras.forEach(palabra => {
                let top = parseFloat(palabra.style.top);
                let velocityY = parseFloat(palabra.dataset.velocityY);

                velocityY = velocidad; // Aumentar la velocidad debido a la gravedad
                top += velocityY; // Actualizar la posición de la palabra
                palabra.style.top = top + 'px';
                palabra.dataset.velocityY = velocityY;

                // Si toca el fondo, perder vida y eliminar palabra
                if (top + palabra.clientHeight > wordContainer.clientHeight) {
                    palabra.remove();
                    perderVida();
                }
            });
        }
    }

    function verificarPalabra() {
        if (!paused) {
            const palabras = document.querySelectorAll('.word');
            palabras.forEach(palabra => {
                if (inputField.value === palabra.textContent) {
                    palabra.remove();
                    inputField.value = '';
                    aumentarDificultad();
                }
            });
        }
    }

    function aumentarDificultad() {
        puntuacion++;
        scoreElement.textContent = `Puntuación: ${puntuacion}`;
        if (puntuacion % 10 === 0) {
            nivel++;
            levelElement.textContent = `Nivel: ${nivel}`;
            if (nivel % 2 === 0) {
                cambiarPalabras();
            }
            if (nivel % 3 === 0) {
                cambiarVelocidad();
            }
            if (vidas === 3) { // Bonificación de vida extra
                vidas++;
                livesElement.textContent = `Vidas: ${vidas}`;
            }
        }
    }

    function perderVida() {
        vidas--;
        livesElement.textContent = `Vidas: ${vidas}`;
        if (vidas === 0) {
            alert("Juego terminado. ¡Inténtalo de nuevo!");
            reiniciarDificultad();
        }
    }

    function cambiarPalabras() {
        if (nivel >= 3) {
            palabras = [...palabrasNivel3];
        } else {
            palabras = [...palabrasNivel1];
        }
    }

    function cambiarVelocidad() {
        velocidad += 0.2; // Ajustamos el incremento de la velocidad para que sea más gradual
        intervalo = Math.max(500, intervalo - 200);
        clearInterval(intervalId);
        intervalId = setInterval(crearPalabra, intervalo);
    }

    function reiniciarDificultad() {
        velocidad = 0.3; // Reiniciamos la velocidad
        intervalo = 4000;
        puntuacion = 0;
        vidas = 3;
        nivel = 1;
      cambiarPalabras()
        timeLeft = 2000;
        scoreElement.textContent = `Puntuación: ${puntuacion}`;
        livesElement.textContent = `Vidas: ${vidas}`;
        levelElement.textContent = `Nivel: ${nivel}`;
        clearInterval(intervalId);
        clearInterval(timeIntervalId);
        intervalId = setInterval(crearPalabra, intervalo);
        timeIntervalId = setInterval(updateTime, 1000);
    }

    function pausarJuego() {
        paused = !paused;
        pauseBtn.textContent = paused ? 'Reanudar' : 'Pausar';
    }

    function reiniciarJuego() {
        clearInterval(intervalId);
        clearInterval(timeIntervalId);
        document.querySelectorAll('.word').forEach(palabra => palabra.remove());
        reiniciarDificultad();
        paused = false;
        pauseBtn.textContent = 'Pausar';
    }

    function updateTime() {
        if (!paused) {
            timeLeft--;
            if (timeLeft <= 0) {
                alert("¡Tiempo agotado! Juego terminado.");
                reiniciarDificultad();
            }
        }
    }

    inputField.addEventListener('input', verificarPalabra);
    pauseBtn.addEventListener('click', pausarJuego);
    restartBtn.addEventListener('click', reiniciarJuego);

    intervalId = setInterval(crearPalabra, intervalo);
    setInterval(moverPalabras, 20);
    timeIntervalId = setInterval(updateTime, 1000);
});