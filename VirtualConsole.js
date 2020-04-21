export default class VirtualConsole {

  constructor( pCols, pLines, pWi, pHe, pFont, pSize) {

    this.nbCols = pCols
    this.nbLines = pLines
    this.W = pWi
    this.H = pHe

    this.originX=0
    this.originY=0

    this.cursorX=0
    this.cursorY=0
    this.offSet=0

    this.inkC=''
    this.backgroundC=''

    this.fontName = pFont
    this.fontSize = pSize
    
    this.setInk('white') // Defaults
    this.setBg('black')

    this.nbElems = this.nbCols * this.nbLines
    this.inks = new Array(this.nbElems)
    this.bgs  = new Array(this.nbElems)
    this.chars= new Array(this.nbElems)

    this.clear()

  }

  setXcursor(x) { 
    this.cursorX = x 
    this.offSet = this.cursorY * this.nbCols + x
    } // text cursor

  setYcursor(y) { 
    this.cursorY = y
    this.offSet = this.cursorY * this.nbCols + this.cursorX
  } // text cursor

  gotoXY(x,y) {
    // todo : bound check and default value ?
    /*
    if(x>NBcol) console.log('x out of bounds, setting to max') && x = this.nbCols
    if(y>)
    */
    this.cursorX = x 
    this.cursorY = y 
    this.offSet = this.cursorY * this.nbCols + this.cursorX
    
  }

  clear() {
    this.inks.fill(this.inkC)
    this.bgs.fill(this.backgroundC)
    this.chars.fill(' ')
    this.cursorX = 0 
    this.cursorY = 0 
    this.offSet = 0

  }

  setInk(ink) {
    this.inkC=ink
  }

  setBg(bg) {
    this.backgroundC=bg
  }

  putchar(c) {
    this.chars[this.offSet]=c
    this.inks[this.offSet]=this.inkC
    this.bgs[this.offSet++]=this.backgroundC
    if (this.cursorX++ === this.nbCols) {
      this.cursorX=0
      this.cursorY++
      // TODO ,   check for Y too big
    }
    this.offSet = this.cursorY * this.nbCols + this.cursorX
    // TODO check for offset too big 'out of screen')
    
  }

  write(s) {
    for(let i=0,n=s.length; i<n; i++) this.putchar(s.charAt(i))
  }

  writeln(s) {
    this.write(s)
    this.cursorX=0
    this.cursorY++
    this.offSet = this.cursorY * this.nbCols // + this.cursorX
  }

  // pixel Display Origine
  setOriginX(x) {
    this.originX=x
  }

  // pixel Display Origine
  setOriginY(y) {
    this.originY=y
  }

  draw()   {
    push()
    noStroke()
    fill(this.backgroundC)    
    rect(this.originX,this.originY, this.nbCols*this.W, this.nbLines*this.H)


    textFont(this.fontName)
    textSize(this.fontSize)   

    fill(this.inkC)
    let currentInk=this.inkC
    let currentBG=this.backgroundC
    let xt,yt
    for(let i=0,n=this.chars.length; i<n ; i++ ){
      if (this.chars[i]!==' ') {
        if (this.inks[i]!=currentInk) {
          fill(this.inks[i])
          currentInk=this.inks[i]
          }
        yt= Math.floor(i/this.nbCols) * this.H
        xt= (i % this.nbCols) * this.W
        text(this.chars[i], xt + this.originX, this.originY + yt + this.H)    
        // console.log("yt =" + yt + " xt=" + xt + "lettre=" + this.chars[i])
        // ▓▒░ 178 177 176
        // █ 219 ■ 
      }

    }
    pop()
  }
}