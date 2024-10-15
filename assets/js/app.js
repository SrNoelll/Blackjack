//hacemos la clase baraja
class Baraja {
    constructor() {
        this.cartas = []; //array de cartas
    }
    //metodo para crear la baraja
    crearBaraja() {
        let baraja = [];
        let tipoCarta = ['C', 'D', 'P', 'T'];
        let especiales = ['A', 'K', 'Q', 'J'];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipoCarta) { //da valor a las cartas normales
                baraja.push(i + tipo);
            }
        }
        for (let tipo of tipoCarta) { // da valor a las cartas especiales
            for (let esp of especiales) {
                baraja.push(esp + tipo);
            }
        }
        baraja = _.shuffle(baraja);
        this.cartas = baraja;
    }

    pedirCarta() {
        if (this.cartas.length === 0) {
            throw "No hay cartas";
        }
        const carta = this.cartas.pop();
        return carta;
    }

    numeroCarta(carta) {
        let numero = carta.substring(0, carta.length - 1);
        isNaN(numero) ? numero === 'A' ? numero = 11 : numero = 10 : numero *= 1;
        return numero;
    }
}

class Jugador {
    constructor(espacio) {
        this.cartas = [];
        this.suma = [];
        this.cartasNum = [];
        this.pasar = false;
        this.espacio = espacio;
        this.sumaElemento = this.espacio.querySelector('.sumaJugadores'); // Acceder al div de suma
    }

    pedirJugador() {
        this.cartas.push(baraja.pedirCarta());
        this.cartasNum.push(baraja.numeroCarta(this.cartas[this.cartas.length - 1]));
        this.suma = this.cartasNum.reduce((suma, carta) => suma + carta, 0);
        this.añadirCartaJugador();
        this.actualizarSumaJugador(); // Actualizar la suma del jugador en la interfaz
    }

    añadirCartaJugador() {
        const ultimaCarta = this.cartas[this.cartas.length - 1];
        const imagen = document.createElement('img');
        imagen.classList.add('JugadorCarta');
        imagen.src = 'assets/images/cartas/' + ultimaCarta + '.png';
        this.espacio.appendChild(imagen);
    }

    actualizarSumaJugador() {
        this.sumaElemento.textContent = this.suma; // Mostrar la suma en el div
    }
}


class Crupier {
    constructor() {
        this.cartas = [];
        this.suma = 0;
        this.cartasNum = [];
        this.cartaOcultaElemento = null; // Almacena la carta oculta para mostrarla más tarde
    }

    pedirCrupier(oculta) {
        this.cartas.push(baraja.pedirCarta());
        this.cartasNum.push(baraja.numeroCarta(this.cartas[this.cartas.length - 1]));
        this.suma = this.cartasNum.reduce((suma, carta) => suma + carta, 0);
        if (oculta === undefined) {
            this.añadirCartaCrupier();
        } else {
            this.añadirCartaCrupier(true);
        }
    }

    añadirCartaCrupier(oculta) {
        const ultimaCarta = this.cartas[this.cartas.length - 1];
        const imagen = document.createElement('img');
        imagen.classList.add('CrupierCarta');

        if (oculta === undefined) {
            imagen.src = 'assets/images/cartas/' + ultimaCarta + '.png';
        } else {
            imagen.src = 'assets/images/cartas/reverso-rojo.png';
            this.cartaOcultaElemento = imagen; // Guardamos la referencia de la carta oculta
        }

        espacioCrupier.appendChild(imagen);
    }

    revelarCartaOculta() {
        if (this.cartaOcultaElemento) {
            const cartaOculta = this.cartas[1]; // La segunda carta es la oculta
            this.cartaOcultaElemento.src = 'assets/images/cartas/' + cartaOculta + '.png';
            this.cartaOcultaElemento = null; // Limpiamos la referencia
        }
    }
}

//seleccionamos los botones de dom
const pedir = document.querySelector("#pedir"),
	pasar = document.querySelector("#pasar"),
	reiniciar = document.querySelector("#reiniciar"),
	propina = document.querySelector("#propina"),
//crea las zonas de los jugadores
    zonaJugador1 = document.querySelector("#jugador1Espacio"),
	zonaJugador2 = document.querySelector("#jugador2Espacio"),
	zonaJugador3 = document.querySelector("#jugador3Espacio"),
	zonaJugador4 = document.querySelector("#jugador4Espacio"),
	zonaJugador5 = document.querySelector("#jugador5Espacio"),
	zonaJugador6 = document.querySelector("#jugador6Espacio"),
	espacioCrupier = document.querySelector("#espacioCrupier"),
    aviso = document.querySelector("#mensajes"),
    //creo los objetos jugadores con sus respectivas zonas como parametro
    jugador1 = new Jugador(zonaJugador1),
    jugador2 = new Jugador(zonaJugador2),
    jugador3 = new Jugador(zonaJugador3),
    jugador4 = new Jugador(zonaJugador4),
    jugador5 = new Jugador(zonaJugador5),
    jugador6 = new Jugador(zonaJugador6),
    //creo el crupier
    crupier = new Crupier,
    //creo la baraja
    baraja = new Baraja();
    //pregunto el numero de jugadores, el minimo es 1 y el maximo 6
    let numeroJugadores = prompt("¿Cuántos jugadores van a participar? (1 a 6)");

    numeroJugadores = Math.min(Math.max(parseInt(numeroJugadores), 1), 6);

    //hago un array de jugadores
    let jugadores = [jugador1, jugador2, jugador3, jugador4, jugador5, jugador6];
    jugadores = jugadores.slice(0, numeroJugadores);
    let turnoActual = 0;

function mensaje(mensaje) {
    let text = document.createElement('p');
    text.textContent = mensaje;
    text.classList.add('textoMensaje');
    aviso.appendChild(text);

    aviso.scrollTop = aviso.scrollHeight;
}

//creo la baraja
baraja.crearBaraja();

crupier.pedirCrupier();
crupier.pedirCrupier(true);

jugadores.forEach(jugador => {
    jugador.pedirJugador();
    jugador.pedirJugador();
});

function actualizarTurno() {
    if (turnoActual >= numeroJugadores) {
        turnoCrupier(); // Aquí se revelará la carta oculta cuando todos hayan pasado
    } else {
        mensaje(`Turno del jugador ${turnoActual + 1}`);
    }
}

function turnoCrupier() {
    crupier.revelarCartaOculta(); // Revelamos la carta oculta antes de que el crupier juegue
    while (crupier.suma < 17) {
        crupier.pedirCrupier();

        if (crupier.suma > 21) {
            mensaje('El crupier se pasa, los jugadores ganan');
            return;
        }
    }

    jugadores.forEach((jugador, index) => {
        if (jugador.suma > 21) {
            mensaje(`Jugador ${index + 1} se pasó y pierde`);
        } else if (crupier.suma > jugador.suma) {
            mensaje(`Crupier gana contra el jugador ${index + 1}`);
        } else if (crupier.suma === jugador.suma) {
            mensaje(`Jugador ${index + 1} empata con el crupier`);
        } else {
            mensaje(`Jugador ${index + 1} gana al crupier`);
        }
    });
}

pedir.addEventListener('click', () => {
    let jugadorActual = jugadores[turnoActual];
    if (jugadorActual.suma < 22 && !jugadorActual.pasar) {
        jugadorActual.pedirJugador();
        if (jugadorActual.suma > 21) {
            mensaje(`Jugador ${turnoActual + 1} se ha pasado, pierde`);
            turnoActual++;
            actualizarTurno();
        }
    }
});

pasar.addEventListener('click', () => {
    let jugadorActual = jugadores[turnoActual];
    jugadorActual.pasar = true;
    mensaje(`Jugador ${turnoActual + 1} pasa su turno`);

    turnoActual++;
    actualizarTurno();
});

propina.addEventListener('click', () => {
    window.open('https://paypal.me/noelll2005?country.x=ES&locale.x=es_ES')
});

actualizarTurno();

reiniciar.addEventListener('click', () => {
    location.reload();
});
