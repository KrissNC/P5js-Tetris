import VirtualConsole from './VirtualConsole.js'
import Tetris from './Tetris.js'
// let vs
let T

function preload() {
}

function setup() {
  createCanvas(400, 300);
  
  T = new Tetris()

}

function draw() {


  if (T.State=="O") { // game Over
    // Game Over
    // To Do Special Display ?
    
  } else {

    T.update()

    // Draw
    background(200)
    
    T.draw()   
  }
  
}



window.preload=preload
window.setup = setup
window.draw = draw


