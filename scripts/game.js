const gameBoard = document.getElementById("game-board");
const movesText = document.getElementById("moves");
const timeText = document.getElementById("timer");

const resultBox = document.getElementById("result-modal");
const resultHeading = document.getElementById("result-title");
const resultInfo = document.getElementById("result-stats");
const againBtn = document.getElementById("play-again");
const backHomeBtn = document.getElementById("home-btn");

const level = localStorage.getItem("selectedDifficulty");
if (!level) window.location.href = "../pages/home.html";

let gridCount = 0;
let maxTime = 0;

if(level == "easy"){
  gridCount = 2 ; 
  maxTime = 180 ; 
}
else if (level === "medium") {
  gridCount = 4;
  maxTime = 120;
} 
else if (level === "hard") {
  gridCount = 6;
  maxTime = 60;
}

gameBoard.classList.add(level);

const pairs = (gridCount * gridCount) / 2;

let emojiList = [
  "🐶", "🐱", "🐭", "🐹", "🦊", "🐻", "🐼", "🐨",
  "🐯", "🦁", "🐮", "🐸", "🐵", "🐔", "🦋", "🐞",
  "🐢", "🐙", "🐠", "🐧", "🐰", "🦄", "🐝", "🦖",
  "🐲", "🐺", "🦆", "🐍", "🦜", "🐳", "🐘"
];
emojiList = emojiList.slice(0, pairs);

let firstPick = null;
let secondPick = null;
let boardLocked = false;
let moveCount = 0;
let matchCount = 0;
let timeUsed = 0;
let gameTimer;

function startGame() {
  gameBoard.innerHTML = "";
  moveCount = 0;
  matchCount = 0;
  timeUsed = 0;

  movesText.textContent = moveCount;
  timeText.textContent = formatTime(maxTime);

  let allCards = [];
  for(let emoji in emojiList){
    allCards.push(emojiList[emoji]); 
    allCards.push(emojiList[emoji]); 
  }

  for (let i = allCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
  }

  allCards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="inner">
        <div class="front"></div>
        <div class="back">${symbol}</div>
      </div>
    `;
    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });

  clearInterval(gameTimer);
  startCountdown();
}

function flipCard(card) {
  if (boardLocked || card.classList.contains("flip")) return;

  card.classList.add("flip");

  if (!firstPick) {
    firstPick = card;
    return;
  }

  secondPick = card;
  moveCount++;
  movesText.textContent = moveCount;

  checkMatch();
}

function checkMatch() {
  const firstEmoji = firstPick.querySelector(".back").textContent;
  const secondEmoji = secondPick.querySelector(".back").textContent;

  if (firstEmoji === secondEmoji) {
    firstPick.classList.add("matched");
    secondPick.classList.add("matched");
    matchCount++;
    resetSelection();

    if (matchCount === pairs) finishGame(true);
  } else {
    boardLocked = true;
    setTimeout(() => {
      firstPick.classList.remove("flip");
      secondPick.classList.remove("flip");
      resetSelection();
    }, 800);
  }
}

function resetSelection() {
  firstPick = null;
  secondPick = null;
  boardLocked = false;
}

function startCountdown() {
  gameTimer = setInterval(() => {
    timeUsed++;
    const remaining = maxTime - timeUsed;
    timeText.textContent = formatTime(remaining);

    if (remaining <= 0) {
      clearInterval(gameTimer);
      finishGame(false);
    }
  }, 1000);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

function finishGame(won) {
  clearInterval(gameTimer);
  saveGame(won);

  resultHeading.textContent = won
    ? "🎉 You Matched Them All!"
    : "⏰ Time's Up!";
  resultInfo.textContent = `Level: ${level.toUpperCase()} | Moves: ${moveCount} | Time Used: ${formatTime(timeUsed)}`;
  resultBox.classList.remove("hidden");
}

function saveGame(won) {
  const history = JSON.parse(localStorage.getItem("gameHistory")) || [];
  const gameData = {
    difficulty: level,
    moves: moveCount,
    time: formatTime(timeUsed),
    status: won ? "Win" : "Lose",
    date: new Date().toLocaleString(),
  };
  history.push(gameData);
  localStorage.setItem("gameHistory", JSON.stringify(history));
}

againBtn.addEventListener("click", () => {
  resultBox.classList.add("hidden");
  startGame();
});

backHomeBtn.addEventListener("click", () => {
  window.location.href = "../pages/home.html";
});

startGame();
