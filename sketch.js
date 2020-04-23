import VirtualConsole from './VirtualConsole.js'
import Tetris from './Tetris.js'
// let vs
let T


function preload() {
}

function setup() {
  createCanvas(640, 400);
  
  T = new Tetris()

  //window.keyPressed = T.keyPressed
  console.log(T)

}

function draw() {

  // game Timing


  // input

  // game logic
  if (T.nCurrentY<=16) T.update()

  // Draw
  
  background(200)

  
  T.draw() 
  
}



window.preload=preload
window.setup = setup
window.draw = draw


