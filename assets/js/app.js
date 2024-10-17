(() => {
    //hacemos la clase baraja
    class Baraja {
        constructor() {
            this.cartas = []; //aqui guardamos las cartas, inicialmente está vacía
        }
        //metodo para crear la baraja
        crearBaraja() {
            let baraja = []; //array donde vamos a ir metiendo todas las cartas
            let tipoCarta = ['C', 'D', 'P', 'T']; //estos son los palos de las cartas
            let especiales = ['A', 'K', 'Q', 'J']; //aqui las cartas especiales que no tienen número
            for (let i = 2; i <= 10; i++) { //bucle para generar las cartas del 2 al 10
                for (let tipo of tipoCarta) { //aqui recorremos los palos y añadimos las cartas normales
                    baraja.push(i + tipo); //concatenamos el número con el palo y lo metemos en la baraja
                }
            }
            for (let tipo of tipoCarta) { //aqui recorremos otra vez los palos pero ahora con las cartas especiales
                for (let esp of especiales) { //recorremos las cartas A, K, Q, J
                    baraja.push(esp + tipo); //metemos cada especial con su palo en la baraja
                }
            }
            baraja = _.shuffle(baraja); //mezclamos la baraja para que no esté en orden
            this.cartas = baraja; //guardamos la baraja mezclada en el atributo cartas
        }

        pedirCarta() {
            if (this.cartas.length === 0) { //si ya no quedan cartas en la baraja, salta error
                throw "No hay cartas"; //aqui tiramos un error para avisar que no quedan cartas
            }
            const carta = this.cartas.pop(); //sacamos la última carta de la baraja
            return carta; //devolvemos la carta
        }

        numeroCarta(carta) {
            let numero = carta.substring(0, carta.length - 1); //quitamos el palo para quedarnos solo con el número o letra
            //aqui comprobamos si la carta es un número o una especial y le asignamos su valor
            isNaN(numero) ? numero === 'A' ? numero = 11 : numero = 10 : numero *= 1; //si es 'A' vale 11, si es K, Q o J vale 10, si no es un número normal
            return numero; //devolvemos el valor numérico de la carta
        }
    }

    //hacemos la clase jugador, para gestionar las cartas y la suma de cada jugador
    class Jugador {
        constructor(espacio) {
            this.cartas = []; //aqui se guardan las cartas del jugador
            this.suma = []; //aqui la suma de las cartas, para llevar la cuenta de los puntos
            this.cartasNum = []; //valores numéricos de las cartas que tiene el jugador
            this.pasar = false; //indica si el jugador decide pasar su turno
            this.espacio = espacio; //el espacio en la interfaz donde se muestran sus cartas
            this.sumaElemento = this.espacio.querySelector('.sumaJugadores'); //elemento en la interfaz para mostrar la suma
        }

        pedirJugador() {
            this.cartas.push(baraja.pedirCarta()); //añadimos una carta a la mano del jugador
            this.cartasNum.push(baraja.numeroCarta(this.cartas[this.cartas.length - 1])); //obtenemos el valor numérico de la carta y lo guardamos
            this.suma = this.cartasNum.reduce((suma, carta) => suma + carta, 0); //sumamos todas las cartas que tiene el jugador
            this.añadirCartaJugador(); //mostramos la carta en la interfaz
            this.actualizarSumaJugador(); //actualizamos la suma en la interfaz
        }

        añadirCartaJugador() {
            const ultimaCarta = this.cartas[this.cartas.length - 1]; //obtenemos la última carta que pidio el jugador
            const imagen = document.createElement('img'); //creamos una imagen para mostrar la carta
            imagen.classList.add('JugadorCarta'); //añadimos una clase CSS para darle estilo
            imagen.src = 'assets/images/cartas/' + ultimaCarta + '.png'; //le asignamos la ruta de la imagen de la carta
            this.espacio.appendChild(imagen); //añadimos la carta al espacio del jugador en la interfaz
        }

        actualizarSumaJugador() {
            this.sumaElemento.textContent = this.suma; //mostramos la nueva suma del jugador en la interfaz
        }
    }

    //hacemos la clase crupier, que es como un jugador pero con reglas específicas
    class Crupier {
        constructor() {
            this.cartas = []; //aqui guardamos las cartas del crupier
            this.suma = 0; //la suma de los valores de las cartas
            this.cartasNum = []; //los valores numéricos de las cartas que tiene
            this.cartaOcultaElemento = null; //guardamos la referencia a la carta oculta del crupier para mostrarla luego
        }

        pedirCrupier(oculta) {
            this.cartas.push(baraja.pedirCarta()); //añadimos una carta a la mano del crupier
            this.cartasNum.push(baraja.numeroCarta(this.cartas[this.cartas.length - 1])); //obtenemos el valor numérico de la carta
            this.suma = this.cartasNum.reduce((suma, carta) => suma + carta, 0); //sumamos todas las cartas que tiene el crupier
            if (oculta === undefined) { //si no es oculta, la mostramos
                this.añadirCartaCrupier();
            } else {
                this.añadirCartaCrupier(true); //si es oculta, mostramos el reverso
            }
        }

        añadirCartaCrupier(oculta) {
            const ultimaCarta = this.cartas[this.cartas.length - 1]; //obtenemos la última carta del crupier
            const imagen = document.createElement('img'); //creamos una imagen para mostrar la carta
            imagen.classList.add('CrupierCarta'); //añadimos una clase CSS para el estilo

            if (oculta === undefined) {
                imagen.src = 'assets/images/cartas/' + ultimaCarta + '.png'; //si no es oculta, mostramos la carta normal
            } else {
                imagen.src = 'assets/images/cartas/reverso-rojo.png'; //si es oculta, mostramos el reverso
                this.cartaOcultaElemento = imagen; //guardamos la referencia a la carta oculta
            }

            espacioCrupier.appendChild(imagen); //añadimos la carta al espacio del crupier en la interfaz
        }

        revelarCartaOculta() {
            if (this.cartaOcultaElemento) { //si hay una carta oculta
                const cartaOculta = this.cartas[1]; //la segunda carta es la oculta
                this.cartaOcultaElemento.src = 'assets/images/cartas/' + cartaOculta + '.png'; //cambiamos la imagen al valor real de la carta
                this.cartaOcultaElemento = null; //limpiamos la referencia de la carta oculta
            }
        }
    }

    //seleccionamos los botones y zonas del DOM
    const pedir = document.querySelector("#pedir"),
        pasar = document.querySelector("#pasar"),
        reiniciar = document.querySelector("#reiniciar"),
        propina = document.querySelector("#propina"),
        zonaJugador1 = document.querySelector("#jugador1Espacio"),
        zonaJugador2 = document.querySelector("#jugador2Espacio"),
        zonaJugador3 = document.querySelector("#jugador3Espacio"),
        zonaJugador4 = document.querySelector("#jugador4Espacio"),
        zonaJugador5 = document.querySelector("#jugador5Espacio"),
        zonaJugador6 = document.querySelector("#jugador6Espacio"),
        espacioCrupier = document.querySelector("#espacioCrupier"),
        aviso = document.querySelector("#mensajes"),
        jugador1 = new Jugador(zonaJugador1),
        jugador2 = new Jugador(zonaJugador2),
        jugador3 = new Jugador(zonaJugador3),
        jugador4 = new Jugador(zonaJugador4),
        jugador5 = new Jugador(zonaJugador5),
        jugador6 = new Jugador(zonaJugador6),
        crupier = new Crupier, //creamos el crupier
        baraja = new Baraja(); //creamos la baraja

    //preguntamos el número de jugadores y lo limitamos entre 1 y 6
    let numeroJugadores = prompt("¿Cuántos jugadores van a participar? (1 a 6)");
    numeroJugadores = Math.min(Math.max(parseInt(numeroJugadores), 1), 6);

    //creamos un array con los jugadores según el número indicado
    let jugadores = [jugador1, jugador2, jugador3, jugador4, jugador5, jugador6];
    jugadores = jugadores.slice(0, numeroJugadores); //recortamos el array al número de jugadores
    let turnoActual = 0; //empezamos con el turno del primer jugador

    //función para mostrar mensajes en pantalla
    function mensaje(mensaje) {
        let text = document.createElement('p');
        text.textContent = mensaje;
        text.classList.add('textoMensaje');
        aviso.appendChild(text); //añadimos el mensaje al div
        aviso.scrollTop = aviso.scrollHeight; //hacemos scroll hacia abajo para ver siempre el último mensaje
    }

    //creamos la baraja
    baraja.crearBaraja();

    //el crupier pide dos cartas, una visible y otra oculta
    crupier.pedirCrupier();
    crupier.pedirCrupier(true);

    //cada jugador pide dos cartas al inicio del juego
    jugadores.forEach(jugador => {
        jugador.pedirJugador();
        jugador.pedirJugador();
    });

    //función para actualizar el turno
    function actualizarTurno() {
        if (turnoActual >= numeroJugadores) { //si ya jugaron todos los jugadores
            turnoCrupier(); //es el turno del crupier
        } else {
            mensaje(`Turno del jugador ${turnoActual + 1}`); //mostramos el turno del jugador actual
        }
    }

    //función para gestionar el turno del crupier
    function turnoCrupier() {
        crupier.revelarCartaOculta(); //revelamos la carta oculta del crupier
        while (crupier.suma < 17) { //el crupier sigue pidiendo cartas mientras su suma sea menor a 17
            crupier.pedirCrupier(); //pide otra carta

            if (crupier.suma > 21) { //si el crupier se pasa de 21, los jugadores ganan
                mensaje('El crupier se pasa, los jugadores ganan');
                return; //terminamos el juego
            }
        }

        jugadores.forEach((jugador, index) => { //comparamos la suma de cada jugador con la del crupier
            if (jugador.suma > 21) { //si el jugador se pasó de 21, pierde
                mensaje(`Jugador ${index + 1} se pasó y pierde`);
            } else if (crupier.suma > jugador.suma) { //si el crupier tiene más puntos, gana el crupier
                mensaje(`Crupier gana contra el jugador ${index + 1}`);
            } else if (crupier.suma === jugador.suma) { //si empatan en puntos
                mensaje(`Jugador ${index + 1} empata con el crupier`);
            } else { //si el jugador tiene más puntos que el crupier, gana el jugador
                mensaje(`Jugador ${index + 1} gana al crupier`);
            }
        });
    }

    //evento para pedir cartas al hacer click en el botón "pedir"
    pedir.addEventListener('click', () => {
        let jugadorActual = jugadores[turnoActual]; //jugador que está en turno
        if (jugadorActual.suma < 22 && !jugadorActual.pasar) { //si no se ha pasado de 21 y no ha pasado su turno
            jugadorActual.pedirJugador(); //pide una carta
            if (jugadorActual.suma > 21) { //si se pasa de 21, pierde y pasa el turno
                mensaje(`Jugador ${turnoActual + 1} se ha pasado, pierde`);
                turnoActual++; //cambiamos de turno
                actualizarTurno(); //actualizamos el turno
            }
        }
    });

    //evento para pasar el turno al hacer click en el botón pasar
    pasar.addEventListener('click', () => {
        let jugadorActual = jugadores[turnoActual]; //jugador que está en turno
        jugadorActual.pasar = true; //el jugador pasa su turno
        mensaje(`Jugador ${turnoActual + 1} pasa su turno`);

        turnoActual++; //cambiamos de turno
        actualizarTurno(); //actualizamos el turno
    });

    //evento para la propina
    propina.addEventListener('click', () => {
        window.open('https://paypal.me/noelll2005?country.x=ES&locale.x=es_ES') //abre el enlace para la propina
    });

    //reiniciar el juego al hacer click en el botón reiniciar
    reiniciar.addEventListener('click', () => {
        location.reload(); //reiniciamos la página para empezar de nuevo
    });

    //actualizar turno
    actualizarTurno();
})();