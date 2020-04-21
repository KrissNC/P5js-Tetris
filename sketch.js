import VirtualConsole from './VirtualConsole.js'
import Tetris from './Tetris.js'
// let vs
let T


function preload() {
}

function setup() {
  createCanvas(640, 400);
  
  T = new Tetris()

  console.log(T)

}

function draw() {

  // game Timing


  // input

  // game logic
  T.update()

  // Draw
  
  background(200)
  T.draw() 
  
}

window.preload=preload
window.setup = setup
window.draw = draw

function Rotate(px, py, r)
{
  let pi = 0;
  switch (r)        // (r % 4)
  {
  case 0:  // 0 degrees   // 0  1  2  3
    pi = py * 4 + px;     // 4  5  6  7
    break;                // 8  9 10 11
                          //12 13 14 15

  case 1: // 90 degrees   //12  8  4  0
  pi = 12 + py - (px * 4);//13  9  5  1
  break;                  //14 10  6  2
                          //15 11  7   3

  case 2: // 180 degrees  //15 14 13 12
  pi = 15 - (py * 4) - px;//11 10  9  8
  break;                  // 7  6  5  4
                          // 3  2  1  0

  case 3: // 270 degrees  // 3  7 11 15
  pi = 3 - py + (px * 4); // 2  6 10 14
  break;                  // 1  5  9 13
  }                       // 0  4  8 12
  return pi;

}

function DoesPieceFit(nTetromino, nRotation, nPosX, nPosY)
{
  // // All Field cells >0 are occupied
  // for (let px = 0; px < 4; px++)
  // for (let py = 0; py < 4; py++)
  // {
  // // Get index into piece
  // let pi = Rotate(px, py, nRotation);
  // // Get index into field
  // let fi = (nPosY + py) * nFieldWidth + (nPosX + px);
  // // Check that test is in bounds. Note out of bounds does
  // // not necessarily mean a fail, as the long vertical piece
  // // can have cells that lie outside the boundary, so we'll
  // // just ignore them
  // if (nPosX + px >= 0 && nPosX + px < nFieldWidth)
  // {
  // if (nPosY + py >= 0 && nPosY + py < nFieldHeight)
  // {
  // // In Bounds so do collision check
  // if (tetromino[nTetromino][pi] != L'.' && pField[fi] != 0)
  // return false; // fail on first hit
  // }
  // }
  // }
  return true;
}