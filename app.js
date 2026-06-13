
let score = 0;
let calibrated = false;
let base = 0;

let positionEstimate = 1;
let velocity = 0;

const notes = ["Bb","C","D","Eb","F","G","A"];
let currentNote = "";

// 🎯 real trombone-ish mapping (simplified)
function noteToPosition(note) {
  return {
    "Bb": 1,
    "C": 6,
    "D": 4,
    "Eb": 3,
    "F": 1,
    "G": 4,
    "A": 2
  }[note];
}

function nextNote() {
  currentNote = notes[Math.floor(Math.random() * notes.length)];
  document.getElementById("note").innerText = currentNote;
}

function start() {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission();
  }

  window.addEventListener("devicemotion", handleMotion);
  document.getElementById("status").innerText = "Running...";
}

// 📌 calibration = "1st position"
function calibrate() {
  base = positionEstimate;
  calibrated = true;
  document.getElementById("status").innerText = "Calibrated ✔️";
}

// 🧠 smoothing + motion tracking
function handleMotion(event) {
  let a = event.accelerationIncludingGravity;

  if (!a) return;

  let forward = a.y;

  // smoothing (removes jitter)
  velocity = velocity * 0.85 + forward * 0.15;

  // integrate motion
  positionEstimate += velocity * 0.03;

  // relative to calibration point
  let relative = positionEstimate - base;

  // map to 1–7 slide positions
  let pos = Math.round(4 + relative);

  if (pos < 1) pos = 1;
  if (pos > 7) pos = 7;

  document.getElementById("position").innerText =
    "Position: " + pos;

  // check answer
  if (currentNote && calibrated) {
    if (pos === noteToPosition(currentNote)) {
      score++;
      document.getElementById("score").innerText = "Score: " + score;
      nextNote();
    }
  }
}

// start first note automatically
nextNote();
