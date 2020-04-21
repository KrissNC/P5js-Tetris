import VirtualConsole from './VirtualConsole.js'
export default class Tetris {

  constructor( ) {

    this.nFieldWidth = 12;
    this.nFieldHeight = 18;

    this.State='R'; // Running, Paused, Over, Menu, Waiting

    this.vs = new VirtualConsole(40,20, 8, 12, 'Courier Prime',12)
    this.vs.setOriginX(20)
    this.vs.setOriginY(10)
    this.Screen = this.vs.chars // to directly address VirtualScreen array

    this.pField = new Array(this.nFieldWidth*this.nFieldHeight)
    this.prepareField()

    this.tetromino = new Array(7)
    this.init_tetrominos()


  }

  prepareField() {
    for (let x = 0; x < this.nFieldWidth; x++) // Board Boundary
      for (let y = 0; y < this.nFieldHeight; y++)
        this.pField[y*this.nFieldWidth + x] = (x == 0 || x == this.nFieldWidth - 1 || y == this.nFieldHeight - 1) ? 9 : 0;
  }

  setState(state) {
    this.State=state
  }

  setscreen(st,...params) {
    // either 2 or 3 params : if 2 ofsset directly, if 3 (x,y)
    let index = params.length<2? params[0]: params[0]+params[1]*this.nFieldWidth

    let tempX = index % this.nFieldWidth
    let tempY = Math.floor(index/this.nFieldWidth)

    let ScreenOffset = tempY * this.vs.nbCols + tempX
    let n = st.length
      if( n ==1 ) this.Screen[ScreenOffset]=st
    else
      for(let i=0;i<n;i++) this.Screen[ScreenOffset++]=st.charAt(i)
    return true
  }

  update() {

    // whrite Field into Screen memory
    for (let x=0; x<this.nFieldWidth;x++)
      for (let y=0; y<this.nFieldHeight; y++)
      {
        let c= ' ABCDEFG=#'.charAt(this.pField[y*this.nFieldWidth + x])
        this.setscreen(c,x,y)    
      }
  }

  draw() {

    // R means running
    this.State=='R' && this.vs.draw() 
  }

  Rotate(px, py, r) {
    let pi = 0;
    switch (r) {
      case 0:      // 0 degrees // 0 1 2 3
        pi = py * 4 + px;       // 4 5 6 7
        break;                  // 8 9 10 11
                                //12 13 14 15

      case 1:     // 90 degrees   //12  8 4 0
        pi = 12 + py - (px * 4);  //13  9 5 1
        break;                    //14 10 6 2
                                  //15 11 7 3

      case 2:     // 180 degrees  //15 14 13 12
        pi = 15 - (py * 4) - px;  //11 10  9  8
        break;                    // 7  6  5  4
                                  // 3  2  1  0

      case 3:     // 270 degrees  // 3 7 11 15
        pi = 3 - py + (px * 4);   // 2 6 10 14
        break;                    // 1 5  9 13
    }                             // 0 4  8 12
    return pi;
  }

  DoesPieceFit(nTetromino, nRotation, nPosX, nPosY) {
    // All Field cells >0 are occupied
    for (let px = 0; px < 4; px++)
      for (let py = 0; py < 4; py++) {
        //the couple px,py gives a position in the tetramino...

        // Get index into piece
        let pi = Rotate(px, py, nRotation);

        // Get index into field
        let fi = (nPosY + py) * this.nFieldWidth + (nPosX + px);
    
        // Check that test is in bounds. Note out of bounds does
        // not necessarily mean a fail, as the long vertical piece
        // can have cells that lie outside the boundary, so we'll
        // just ignore them
        if (nPosX + px >= 0 && nPosX + px < this.nFieldWidth) {
          if (nPosY + py >= 0 && nPosY + py < this.nFieldHeight) {
            // In Bounds so do collision check
            if (this.tetromino[nTetromino][pi] != '.' && this.pField[fi] != 0)
              return false; // fail on first hit
          }
        }
      }
    return true;
  }

  init_tetrominos() {
    this.tetromino[0] = "..X...X...X...X." // Tetronimos 4x4
    this.tetromino[1] = "..X..XX...X....."
    this.tetromino[2] = ".....XX..XX....."
    this.tetromino[3] = "..X..XX..X......"
    this.tetromino[4] = ".X...XX...X....."
    this.tetromino[5] = ".X...X...XX....."
    this.tetromino[6] = "..X...X..XX....."
  }

}