const pedir = document.querySelector("#pedir");
const pasar = document.querySelector("#pasar");
const doblarr = document.querySelector("#doblar");
const propina = document.querySelector("#propina");

class Baraja{
    constructor(){
        this.cartas=[];
    }
    crearBaraja(){
        let baraja = [];
        let tipoCarta = ['C','D','P','T'];
        let especiales = ['A','K','Q','J'];
        for(let i = 2;i<=10;i++){
            for(let tipo of tipoCarta){
                baraja.push(i + tipo);
            }
        }
        for(let tipo of tipoCarta){
            for(let esp of especiales){
                baraja.push(esp + tipo);
            }
        }
        baraja = _.shuffle(baraja);
        this.cartas=baraja;
    }
    pedirCarta() {
        if(this.cartas.length === 0){
            throw "No hay cartas";
        }
        const carta = this.cartas.pop();
        return carta;
    }
    numeroCarta(carta){
        let numero = carta.substring(0,carta.length-1)
        isNaN(numero)?numero === 'A' ? numero = 11: numero = 10:numero *= 1;
        return numero;
    }
}

class Jugador{
    constructor(espacio){
        this.cartas=[];
        this.suma=[];
        this.cartasNum=[];
        this.pasar=false;
        this.espacio=espacio;
    }
    pedirJugador(){
        this.cartas.push(baraja.pedirCarta());
        this.cartasNum.push(baraja.numeroCarta(this.cartas[this.cartas.length-1]))
        this.suma = this.cartasNum.reduce((suma, carta) => suma + carta, 0);
        console.log(this.cartas, this.suma);
        this.añadirCartaJugador()
    }
    añadirCartaJugador(){
        const ultimaCarta = this.cartas[this.cartas.length - 1];
        const imagen = document.createElement('img');
        imagen.classList.add('JugadorCarta');
        imagen.src = 'assets/images/cartas/' + ultimaCarta + '.png';
        console.log(this.espacio);
        this.espacio.appendChild(imagen);
    }
}

class Crupier{
    constructor(){
        this.cartas=[];
        this.suma=0;
        this.cartasNum=[];
    }
    pedirCrupier(){
        this.cartas.push(baraja.pedirCarta());
        this.cartasNum.push(baraja.numeroCarta(this.cartas[this.cartas.length-1]))
        this.suma = this.cartasNum.reduce((suma, carta) => suma + carta, 0);
        console.log(this.cartas, this.suma);
        this.añadirCartaCrupier();
    }
    añadirCartaCrupier(){
        const ultimaCarta = this.cartas[this.cartas.length - 1];
        const imagen = document.createElement('img');
        imagen.classList.add('CrupierCarta');
        imagen.src = 'assets/images/cartas/' + ultimaCarta + '.png';
        espacioCrupier.appendChild(imagen);
    }
}
const aviso=document.querySelector("#mensajes");

function mensaje(mensaje) {
    let text = document.createElement('p');
    text.textContent = mensaje;
    text.classList.add('textoMensaje');
    aviso.appendChild(text);

    aviso.scrollTop = aviso.scrollHeight;
}


const zonaJugador1=document.querySelector("#jugador1Espacio");

const zonaJugador2=document.querySelector("#jugador2Espacio");

const zonaJugador3=document.querySelector("#jugador3Espacio");

const zonaJugador4=document.querySelector("#jugador4Espacio");

const zonaJugador5=document.querySelector("#jugador5Espacio");

const zonaJugador6=document.querySelector("#jugador6Espacio");

const espacioCrupier = document.querySelector("#espacioCrupier");

const jugador1 = new Jugador(zonaJugador1);
const jugador2 = new Jugador(zonaJugador2);
const jugador3 = new Jugador(zonaJugador3);
const jugador4 = new Jugador(zonaJugador4);
const jugador5 = new Jugador(zonaJugador5);
const jugador6 = new Jugador(zonaJugador6);

const crupier = new Crupier;
const baraja = new Baraja();

let numeroJugadores = prompt("¿Cuántos jugadores van a participar? (1 a 6)");

numeroJugadores = Math.min(Math.max(parseInt(numeroJugadores), 1), 6);

let jugadores = [jugador1, jugador2, jugador3, jugador4, jugador5, jugador6];
jugadores = jugadores.slice(0, numeroJugadores);
let turnoActual = 0;

baraja.crearBaraja();
console.log(baraja.cartas);

crupier.pedirCrupier();
crupier.pedirCrupier();

jugadores.forEach(jugador => {
    jugador.pedirJugador();
    jugador.pedirJugador();
});

function actualizarTurno() {
    if (turnoActual >= numeroJugadores) {
        turnoCrupier();
    } else {
        mensaje(`Turno del jugador ${turnoActual + 1}`);
    }
}

function turnoCrupier() {
    console.log('Turno del crupier');
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