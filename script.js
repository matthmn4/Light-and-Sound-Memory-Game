//Globals
var tonePlaying = false;
var volume = 0.5;
var pattern = [2,2,4,3,2,1,2,4];
var randompattern = [];
var progress = 0;
var gamePlaying = false;
var guessCounter = 0;
var clueHoldTime = 400;
var id;

const cluePauseTime = 300;
const nextClueWaitTime = 500;

function startGame() {
  randompattern = [];
  startTimer();
  progress = 0;
  gamePlaying = true;
  getRandomSequence();
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  clearInterval(id)
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit");
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit");
}

function getRandomSequence() {
  for (let i = 0; i < 4; i++) {
    randompattern.push(Math.floor(Math.random() * (7 - 1) + 1));
  }
  console.log(randompattern);
}

function playSingleClue(btn){
  if(gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime;
  for(let i=0; i<=progress; i++){
    console.log("Play single clue: " + randompattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, randompattern[i]);
    delay += clueHoldTime - 120
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Congratulations, you won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  //check if guess was right
  if (randompattern[guessCounter] == btn) {
    //progress with game
    if (guessCounter == progress){
      //test to reach the end of the sequence
      if (randompattern.length-1 == progress){
        winGame()
      } else{
        progress++;
        playClueSequence();
        }
    }else{
      guessCounter++;
    } 
} else{
    loseGame();  
}
} 

function startTimer() {
  var elem = document.getElementById("myBar");
  var width = 0;
  id = setInterval(frame, 325);
  function frame() {
    if (width == 100) {
      clearInterval(id);
      loseGame();
    } else {
      width++;
      elem.style.width = width + '%';
    }
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 500,
  6: 578
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)