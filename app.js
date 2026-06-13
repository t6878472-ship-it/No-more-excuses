const notes = [
  { name: "Bb", pos: 1 },
  { name: "A", pos: 2 },
  { name: "Ab", pos: 3 },
  { name: "G", pos: 4 },
  { name: "Gb", pos: 5 },
  { name: "F", pos: 6 },
  { name: "E", pos: 7 }
];

let score = 0;
let slide = 1;
let currentNote = null;

const noteEl = document.getElementById("note");
const slideEl = document.getElementById("slide");
const scoreEl = document.getElementById("score");

function getRandomNote() {
  return notes[Math.floor(Math.random() * notes.length)];
}

function newQuestion() {
  currentNote = getRandomNote();
  noteEl.textContent = currentNote.name;
}

function updateUI() {
  slideEl.textContent = slide;
  scoreEl.textContent = score;
}

document.getElementById("submit").addEventListener("click", () => {

  if (slide === currentNote.pos) {
    score++;
  }

  updateUI();
  newQuestion();
});

let lastZ = 0;
let cooldown = false;

window.addEventListener("devicemotion", (event) => {

  if (!event.accelerationIncludingGravity) return;

  const z = event.accelerationIncludingGravity.z;

  if (cooldown) {
    lastZ = z;
    return;
  }

  const delta = z - lastZ;
  lastZ = z;

  if (delta < -4) {
    slide = Math.min(7, slide + 1);
    updateUI();
    triggerCooldown();
  }

  if (delta > 4) {
    slide = Math.max(1, slide - 1);
    updateUI();
    triggerCooldown();
  }
});

function triggerCooldown() {
  cooldown = true;

  setTimeout(() => {
    cooldown = false;
  }, 250);
}

updateUI();
newQuestion();
