const gameBoard = document.getElementById('game-board');
const pointsElement = document.getElementById('points');
const comboElement = document.getElementById('combo');
const failsElement = document.getElementById('fails');
const modalElement = document.getElementById('modal');
const finalPointsElement = document.getElementById('final-points');
const finalMovesElement = document.getElementById('final-moves');
const buttonModalElement = document.getElementById('restart-button');

const TOTAL_CARDS = 18;
let firstSelection = null;
let secondSelection = null;
let canPlay = false;
let matches = 0;
let points = 0;
let combo = 0;
let fails = 0;
let moves = 0;

const getRandomNumber = (max = 150) => Math.floor(Math.random() * max + 1);

const startGameShowCards = allCards => {
  allCards.forEach(card => card.classList.add('card--show'));
  const timeoutId = setTimeout(() => {
    allCards.forEach(card => card.classList.remove('card--show'));
    canPlay = true;
    clearInterval(timeoutId);
  }, 4000);
};

const createCard = imageNumber => {
  const newCard = document.createElement('div');
  newCard.classList.add('card');
  newCard.dataset.id = imageNumber;

  const newCardFront = document.createElement('div');
  newCardFront.classList.add('card__front');

  const newPokeCardImage = document.createElement('img');
  newPokeCardImage.src = `assets/images/${imageNumber}.png`;
  newPokeCardImage.classList.add('card__image');
  newCardFront.append(newPokeCardImage);

  const newCardBack = document.createElement('div');
  newCardBack.classList.add('card__back');

  newCard.append(newCardFront, newCardBack);

  return newCard;
};

const drawPokeCards = allCards => {
  const fragment = document.createDocumentFragment();
  allCards.forEach(cardNumber => {
    const newCard = createCard(cardNumber);
    fragment.append(newCard);
  });

  gameBoard.append(fragment);

  const allCardsElements = document.querySelectorAll('.card');

  const timeoutId = setTimeout(() => {
    startGameShowCards(allCardsElements);
    clearTimeout(timeoutId);
  }, 1000);
};

const generatePokeCards = () => {
  const originalCards = [];
  for (let index = 1; index < TOTAL_CARDS / 2 + 1; index++) {
    originalCards.push(getRandomNumber());
  }

  const cardsFiltered = [...new Set(originalCards)];

  if (cardsFiltered.length !== originalCards.length) {
    generatePokeCards();
    return;
  }

  const allPokecards = [...cardsFiltered, ...cardsFiltered];

  for (let i = allPokecards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); //random index
    [allPokecards[i], allPokecards[j]] = [allPokecards[j], allPokecards[i]];
  }

  drawPokeCards(allPokecards);
};

const showSelectedCard = card => {
  card.classList.add('card--show');
};

const hideSelectedCard = card => {
  card.classList.remove('card--show');
};

const checkWin = () => matches === TOTAL_CARDS / 2;

const checkCardsSelected = (firstElementSelected, secondElementSelected) => {
  moves++;
  if (firstElementSelected.dataset.id === secondElementSelected.dataset.id) {
    points += 10;
    points = points + combo;
    pointsElement.textContent = `Total Points: ${points}`;
    combo += 10;
    comboElement.textContent = `X ${combo / 10 + 1}`;
    matches++;
    if (checkWin()) {
      canPlay = false;
      modalElement.classList.add('modal--show');
      finalPointsElement.textContent = `Has conseguido ${points} puntos`;
      finalMovesElement.textContent = `Has hecho un total de ${moves} movimientos con ${fails} fallos`;
    }
  } else {
    fails++;
    combo = 0;
    failsElement.textContent = `Fails: ${fails}`;
    comboElement.textContent = '';
    hideSelectedCard(firstSelection);
    hideSelectedCard(secondSelection);
  }
  firstSelection = null;
  secondSelection = null;
};

gameBoard.addEventListener('click', e => {
  if (!canPlay) return;
  if (!e.target.classList.contains('card__back')) return;
  if (!firstSelection) {
    firstSelection = e.target.parentElement;
    showSelectedCard(firstSelection);
  } else if (!secondSelection) {
    secondSelection = e.target.parentElement;
    showSelectedCard(secondSelection);
    secondSelection.addEventListener(
      'transitionend',
      () => {
        checkCardsSelected(firstSelection, secondSelection);
      },
      { once: true }
    );
  }
});

buttonModalElement.addEventListener('click', () => {
  gameBoard.innerHTML = '';
  firstSelection = null;
  secondSelection = null;
  canPlay = false;
  matches = 0;
  points = 0;
  combo = 0;
  fails = 0;
  moves = 0;
  modalElement.classList.remove('modal--show');

  generatePokeCards();
});

generatePokeCards();
