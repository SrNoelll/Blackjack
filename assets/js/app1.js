//definicion de variables globales
let baraja  = [];
const tipos = ['C','P','T','D'];
const figu  = ['A','J','Q','K'];
let puntosJugador = 0;
let puntosPc = 0;

//referencias a objetos html
const botonPedir = document.querySelector('#btnPedir');
const botonNuevo = document.querySelector('#btnNuevo');
const botonPasar = document.querySelector('#btnPasar');
const marcador = document.querySelectorAll('small');
const divJugadorCarta = document.querySelector('#jugador-cartas');
const divBancaCarta = document.querySelector('#banca-cartas');
const resultado = document.querySelector('#ganador');

//crear baraja para comenzar a repartir cartas
//la creo con bucles for
const crearBaraja = () => {
    for(let i = 2; i <= 10; i++){
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
    return baraja;
}

//pedir una carta y retirarla de la baraja
const pedirCarta = () =>{
    if(baraja.length === 0){
        throw "No hay cartas";
    }
    const carta = baraja.pop();
    return carta;
}

//calculamos el valor de la carta
const valorCarta = (carta) => {
    let puntos = carta.substring(0, carta.length - 1);
    isNaN(puntos) ? (puntos === 'A' ? puntos = 11 : puntos = 10) : puntos *= 1;
    return puntos;
}

//eventos del juego
botonPedir.addEventListener('click', () => {
    //carta que nos da el cupier
    const carta = pedirCarta();
    puntosJugador += valorCarta(carta);
    marcador[0].innerHTML = puntosJugador;
    const imgCarta = document.createElement('img');
    imgCarta.src = 'assets/images/cartas/' + carta + '.png';
    imgCarta.classList.add('carta');
    divJugadorCarta.append(imgCarta);
    if (puntosJugador >= 21){
        console.log('has perdido');
        
        botonPedir.disabled = true;
        botonPasar.disabled = true;
        turnoBanca(puntosJugador);
    }
});

botonPasar.addEventListener('click', () => {
    botonPedir.disabled = true;
    botonPasar.disabled = true;
    turnoBanca(puntosJugador);
});

botonNuevo.addEventListener('click', () => {
    botonPedir.disabled = false;
    botonPasar.disabled = false;
    baraja = [];
    puntosBanca = 0;
    puntosJugador = 0;
    marcador[0].innerHTML = "0";
    marcador[1].innerHTML = "0";
    divBancaCarta.innerHTML = '';  // Se añadió la asignación vacía para limpiar la banca
});

//turno de la banca
const turnoBanca = (puntosBanca) => {
    do {
        const cartaB = pedirCarta();
        puntosBanca += valorCarta(cartaB);
        marcador[1].innerHTML = puntosBanca;
        const imgCartaB = document.createElement('img');
        imgCartaB.src = 'assets/images/cartas/' + cartaB + '.png';  // Cambié 'carta' por 'cartaB'
        imgCartaB.classList.add('carta');
        divBancaCarta.append(imgCartaB);
        if (puntosJugador > 21){
            break;
        }
    } while (puntosBanca < puntosJugador && puntosJugador <= 21);
    
    if (puntosBanca === puntosJugador) {
        resultado.innerHTML = "Empate";
    } else if (puntosBanca > puntosJugador && puntosJugador <= 21) {
        resultado.innerHTML = "Gana la Banca";
    } else {
        resultado.innerHTML = "Gana Jugador humano";
    }
}

//main***************************************************

crearBaraja();
console.log(baraja);
valorCarta(pedirCarta());
console.log(baraja);
