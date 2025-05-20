
let cardsData = [
    { name: 'c1', img: 'images/c1.png' },
    { name: 'c2', img: 'images/c2.png' },
    { name: 'c3', img: 'images/c3.png' },
    { name: 'c4', img: 'images/c4.png' },
    { name: 'c5', img: 'images/c5.png' },
    { name: 'c6', img: 'images/c6.png' },
    { name: 'c7', img: 'images/c7.png' },
    { name: 'c8', img: 'images/c8.png' },
    { name: 'c9', img: 'images/c9.png' },
    { name: 'c1', img: 'images/c1.png' },
    { name: 'c2', img: 'images/c2.png' },
    { name: 'c3', img: 'images/c3.png' },
    { name: 'c4', img: 'images/c4.png' },
    { name: 'c5', img: 'images/c5.png' },
    { name: 'c6', img: 'images/c6.png' },
    { name: 'c7', img: 'images/c7.png' },
    { name: 'c8', img: 'images/c8.png' },
    { name: 'c9', img: 'images/c9.png' },
];

let cards = [];
let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];
let board;
let resultView;

// Variáveis de áudio no escopo global
const fundoAudio = document.getElementById("fundoAudio");
const flipSound = document.getElementById("flipSound");
const matchSound = document.getElementById("matchSound");
const winSound = document.getElementById("winSound");

// Define o volume padrão para a música de fundo
if (fundoAudio) fundoAudio.volume = 0.5;


document.addEventListener('DOMContentLoaded', () => {
    initializeGame();

    // Inicia a música de fundo após a primeira interação do usuário
    document.addEventListener('click', iniciarMusica);
    document.addEventListener('touchstart', iniciarMusica);
});

function iniciarMusica() {
    if (fundoAudio) {
        fundoAudio.play()
            .then(() => {
                console.log("Música de fundo iniciada após interação do usuário.");
                // Remove os listeners para não iniciar a música múltiplas vezes
                document.removeEventListener('click', iniciarMusica);
                document.removeEventListener('touchstart', iniciarMusica);
            })
            .catch(error => {
                console.error("Erro ao iniciar a música de fundo:", error);
            });
    }
}


function recarregarPagina() {
    location.reload();
}

function initializeGame() {
    // Criar uma cópia fresca dos dados das cartas
    cardsData = [...cardsData];
    cardsData.sort(() => 0.5 - Math.random());
    cardsChosen = [];
    cardsChosenId = [];
    cardsWon = [];
    board = document.querySelector('.board');
    resultView = document.querySelector('#result');
    board.innerHTML = '';
    resultView.textContent = 'Pares Encontrados: 0';
    createBoard();
    //fundoAudio.play();  // Removemos daqui
}

function createBoard() {
    cards = [];
    for (let i = 0; i < cardsData.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', i);

        const frontFace = document.createElement('div');
        frontFace.classList.add('card-face', 'card-front');
        frontFace.style.backgroundImage = `url(${cardsData[i].img})`;
        frontFace.style.backgroundSize = 'cover';
        frontFace.style.backgroundPosition = 'center';

        const backFace = document.createElement('div');
        backFace.classList.add('card-face', 'card-back');
        backFace.style.backgroundImage = `url(images/fd.png)`;
        backFace.style.backgroundSize = 'cover';
        backFace.style.backgroundPosition = 'center';

        card.appendChild(frontFace);
        card.appendChild(backFace);
        card.addEventListener('click', flipCard);
        board.appendChild(card);
        cards.push(card);
    }
}

function checkForMatch() {
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];

    if (optionOneId === optionTwoId) {
        cards[optionOneId].classList.remove('flipped');
        cards[optionTwoId].classList.remove('flipped');
    } else if (cardsChosen[0] === cardsChosen[1]) {
        cards[optionOneId].removeEventListener('click', flipCard);
        cards[optionTwoId].removeEventListener('click', flipCard);
        cardsWon.push(cardsChosen);

        if (matchSound) {
            matchSound.currentTime = 0;
            matchSound.play();
        }

    } else {
        cards[optionOneId].classList.remove('flipped');
        cards[optionTwoId].classList.remove('flipped');
    }

    cardsChosen = [];
    cardsChosenId = [];
    resultView.textContent = 'Pares Encontrados: ' + cardsWon.length;
    if (cardsWon.length === cardsData.length / 2) {
        resultView.textContent = 'Parabéns! Você conseguiu encontrar todas as cartas';

        if (winSound) {
            fundoAudio.pause(); // Pausa o áudio de fundo
            winSound.currentTime = 0;
            winSound.play();
            winSound.addEventListener('ended', function() {
                fundoAudio.play(); // Retoma o áudio de fundo após a vitória
            });
        }
    }
}

function flipCard() {
    let cardId = this.getAttribute('data-id');
    if (cardsChosenId.includes(cardId)) return;
    cardsChosen.push(cardsData[cardId].name);
    cardsChosenId.push(cardId);
    this.classList.add('flipped');

    if (flipSound) {
        flipSound.currentTime = 0;
        flipSound.play();
    }

    if (cardsChosen.length === 2) {
        setTimeout(checkForMatch, 500);
    }
}

function resetGame() {
    // Limpa completamente o estado do jogo
    cards = [];
    cardsChosen = [];
    cardsChosenId = [];
    cardsWon = [];

    // Reconstroi o tabuleiro do zero
    initializeGame();
}