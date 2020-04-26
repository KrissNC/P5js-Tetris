import VirtualConsole from './VirtualConsole.js'
export default class Tetris {

  constructor( ) {

    this.nFieldWidth = 12;
    this.nFieldHeight = 18;

    this.State='R'; // Running, Paused, Over, Menu, Waiting

    this.vs = new VirtualConsole(40,20, 8, 10, 'Courier Prime',12)
    this.vs.setOriginX(20)
    this.vs.setOriginY(10)
    this.Screen = this.vs.chars // to directly address VirtualScreen array

    this.pField = new Array(this.nFieldWidth*this.nFieldHeight)
    this.prepareField()

    this.tetromino = new Array(7)
    this.init_tetrominos()

    this.nCurrentPiece = 0; // 0 to 6
    this.nCurrentRotation = 0;
    this.nCurrentX = this.nFieldWidth / 2;
    this.nCurrentY = 0;

    this.tickDuration = 40.0  // time base . 
                              // time driven events should rely on this
    this.newHeartBeat = false
    this.currentDuration = 0.0

    this.delayCounter = 0.0
    this.delayDuration = 0.0

    this.bKey=''
    this.keyHeld=false
    this.previousKeyCode=0
    this.requestedAction=''

    this.stepDown = false
    this.tickCount = 0
    this.lvlTick = 8

    this.vLines = []      // completed lines

    this.cpt = 0

    this.gameOver = false

    this.nPieceCount = 0
    this.nSpeed = 0

    this.nScore = 0
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

    /*
    this.vs.gotoXY(20,10)
    this.cpt++
    this.vs.write(this.cpt.toString())

    for (let i=0 ; i< this.nFieldHeight; i++) {
      this.vs.gotoXY(12,i+2)
      this.vs.write(i.toString())
    }
    */

    // affect game time
    this.currentDuration += deltaTime // dt is global in P5js


    if ( this.currentDuration > this.tickDuration) {
      this.newHeartBeat=true
      this.currentDuration -= this.tickDuration  //  ou 0 ? 
    }
    else {
      this.newHeartBeat=false
    }
    
    // collect input
    // result : this.requestedAction (one letter)
    if (keyIsPressed) {
      //console.log(this)
      if (keyCode == this.previousKeyCode) 
      {
        this.keyHeld = true  
      } 
      else 
      {
        //console.log (this)
        switch (keyCode) {
          case 37:
            this.requestedAction = 'L' // move left
            break;
          case 38:
            this.requestedAction = 'U' // rotate
            break;
          case 39:
            this.requestedAction = 'R' // move right
            break;
          case 40:
            this.requestedAction = 'D' // accelerate downwards
            break;
          case 32:
            this.requestedAction = ' ' // accelerate downwards
            break;
  
          case 27:
            this.requestedAction = 'X' // exit
            break;
          default:
        }
        this.previousKeyCode=keyCode
        this.keyHeld = false
        // console.log(keyCode)            
      }
    }
    else {
      this.keyHeld = false
      this.previousKeyCode=0
    }

    if (this.State == "D") {
      // we are Delayed, don't update till delay has passed

      // console.log("Pausing")
      this.delayCounter += deltaTime
      if ( this.delayCounter > this.delayDuration ) {
        // console.log("End of Pause")
        this.delayCounter = 0
        this.delayDuration = 0
        this.setState("R") // TODO previous state in case it would not be 'R'
      }
      else return false;
    }

    else { // duration elapsed let's update for good
      if (this.newHeartBeat) {
        // when the correct timeslice jhas elapsed (HeartBeat), cotinue update
        this.update_running()
      }
    }
  }

  update_running() {

    // console.log(this.State)
    this.tickCount++

    this.stepDown = (this.tickCount == this.tickDuration) ;

    // remove completed lines (occurs after a short 'D' Delay state to mark a pause)

    if(this.vLines.length) { // (if there are completed lines)
      for (let a=0; a<this.vLines.length; a++)
        {
        //console.log(this.pField)
        let l = this.vLines[a]
      
        for (let px = 1; px < this.nFieldWidth - 1; px++) {
          for (let py = l; py >= 0; py--)
            this.pField[py * this.nFieldWidth + px] = this.pField[(py - 1) * this.nFieldWidth + px];
          this.pField[px] = 0;
          }
      }
      // lines are removed, data is copied, now clear the lines array
      this.vLines=[]
    }

    // Handle player movement
    if (this.requestedAction != '') {
      // console.log(this.requestedAction)
      // console.log(this.nCurrentX,this.nCurrentY)
      switch (this.requestedAction) {
        case 'L': // left
          this.nCurrentX -= (this.DoesPieceFit(this.nCurrentPiece, this.nCurrentRotation, this.nCurrentX - 1, this.nCurrentY)) ? 1 : 0;
          break;
        case 'R': // right
          this.nCurrentX += (this.DoesPieceFit(this.nCurrentPiece, this.nCurrentRotation, this.nCurrentX + 1, this.nCurrentY)) ? 1 : 0;
          break;
        case 'D': // down
          this.nCurrentY += (this.DoesPieceFit(this.nCurrentPiece, this.nCurrentRotation, this.nCurrentX, this.nCurrentY + 1)) ? 1 : 0;
          break;
        case 'U': // down
          this.nCurrentRotation += (this.DoesPieceFit(this.nCurrentPiece, this.nCurrentRotation + 1, this.nCurrentX, this.nCurrentY)) ? 1 : 0;
          break;

        default:
      }

      if (this.requestedAction != 'D') this.requestedAction = ''
    }

    // time for a step downwards 
    if(this.stepDown) {
      // let's try to move pice down one step
      if (this.DoesPieceFit(this.nCurrentPiece, this.nCurrentRotation, this.nCurrentX, this.nCurrentY+1)) {
        this.nCurrentY++        
      }
      else {
        // No way to move it : lets fix it

        this.nPieceCount++;
        if (this.nPieceCount % 10 == 0)
          if (this.tickDuration >= 10) 
            {
              // accelerate
              let newDuration = Math.floor(this.tickDuration * 0.87)
              //console.log("Speed going down from " + this.tickDuration + " to " + newDuration)
              this.tickDuration = newDuration
            }
            

        // lock the piece in the field 
        for (let px = 0; px < 4; px++)
          for (let py = 0; py < 4; py++)
            if (this.tetromino[this.nCurrentPiece][this.Rotate(px, py, this.nCurrentRotation)] == 'X')
              this.pField[(this.nCurrentY + py) * this.nFieldWidth + (this.nCurrentX + px)] = this.nCurrentPiece + 1;

        
        // Check if any lines
        for (let py = 0; py < 4; py++) 
          if(this.nCurrentY + py < this.nFieldHeight - 1)
          {
            let bLine = true;
            for (let px = 1; px < this.nFieldWidth - 1; px++)
              bLine &= (this.pField[(this.nCurrentY + py) * this.nFieldWidth + px]) != 0;
            if (bLine) {
              // set line char to 
              for (let px = 1; px < this.nFieldWidth - 1; px++)
                this.pField[(this.nCurrentY + py) * this.nFieldWidth + px] = 8; // putting '='
                this.vLines.push(this.nCurrentY + py); // Adding a line in array of lines
            }
          }

          // Score
          this.nScore += 25;

          if (this.vLines.length) this.nScore += (1 << this.vLines.length) * 100;

          this.requestedAction = ''

        // choose the next piece
        this.nCurrentX = this.nFieldWidth / 2;
        this.nCurrentY = 0;
        this.nCurrentRotation = 0;
        this.nCurrentPiece = Math.floor(random(7))

        // if it won't fit, game over
        this.gameOver = !(this.DoesPieceFit(this.nCurrentPiece, this.nCurrentRotation, this.nCurrentX, this.nCurrentY))
      }

      //reset time counter
      this.tickCount = 0
    }

    // write Field into virtual screen memory
    for (let x = 0; x < this.nFieldWidth; x++)
      for (let y = 0; y < this.nFieldHeight; y++) {
        let c = " ABCDEFG=#".charAt(this.pField[y * this.nFieldWidth + x]);
        this.setscreen(c, x, y + 2);
      }

    // put piece onto virtual screen memory but not on field (display but field is unchanged)
    // to Display it
    for (let px = 0; px < 4; px++)
      for (let py = 0; py < 4; py++) {
        let rotated = this.Rotate(px, py, this.nCurrentRotation);
        if (this.tetromino[this.nCurrentPiece][rotated] != ".") {
          let c = " ABCDEFG=#".charAt(this.nCurrentPiece + 1);

          this.setscreen(c, this.nCurrentX + px, (this.nCurrentY + py + 2))
        }
      }
    
    // draw score
    this.vs.gotoXY(18,5)
    this.vs.write("SCORE :  " + this.nScore.toString() + "  ")

    if (this.gameOver) {

      this.vs.gotoXY(20,10)
      this.vs.write("GAME OVER !")
      this.vs.gotoXY(17,14)
      this.vs.write("press F5 to restart")
  
      this.State="O"
    }
    
    if(this.vLines.length) {
      // there's at least one full line done, lets pause a while, for the player to acknowledge
      this.pause(300) // nothing will occur but Display during that duration : no more updates
    }

  }

  pause(d) {
    //console.log("début de la pause !")
    this.delayDuration = d
    this.setState("D") //  D for Delay
  }

  draw() {    
    this.vs.draw() 
  }

  Rotate(px, py, r) {
    let pi = 0;
    switch (r%4) {
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

  // checks this a piece, rotated or not, would fit at position nPosX,nPosY
  // if not, one of its 'filled cells' will collide with a value of pField !=0 (failure, return false)
  // if every 'filled cell', would be on zeros, then the tetramino would fit (success, return true)
  DoesPieceFit(nTetromino, nRotation, nPosX, nPosY) {
    // All Field cells >0 are occupied
    //console.log("testing fit ", nTetromino)
    for (let px = 0; px < 4; px++)
      for (let py = 0; py < 4; py++) {
        //the couple px,py gives a position in the tetramino...

        // Get index into piece
        let pi = this.Rotate(px, py, nRotation);

        // Get index into field
        let fi = (nPosY + py) * this.nFieldWidth + (nPosX + px);
    
        // Check that test is in bounds. Note out of bounds does
        // not necessarily mean a fail, as the long vertical piece
        // can have cells that lie outside the boundary, so we'll
        // just ignore them
        if (nPosX + px >= 0 && nPosX + px < this.nFieldWidth) {
          if (nPosY + py >= 0 && nPosY + py < this.nFieldHeight) {

            // In Bounds so do collision check
            if (this.tetromino[nTetromino][pi] != '.' && this.pField[fi] != 0) {
              //console.log("Won't fit")
              return false; // fail on first hit
            }
          }
        }
      }
      //console.log("fit !")
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