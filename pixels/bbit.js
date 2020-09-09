// GPLv3 marcos assis 2020

BBoard=function(w,h,s=8,buf=new Uint8ClampedArray(w*h/8)){
  board={
    get width(){
      return w
    },
    get height(){
      return w
    },
    get pixelSize(){
      return s
    },
    get buffer(){
      return buf
    },
    get(p,q){
      a=q===undefined?p:p*w+q
      return buf[a/8|0]>>a%8&1
    },
    set(v,p,q){
      a=q===undefined?p:p*w+q
      o=this.get(a)
      v^o?buf[a/8|0]^=1<<a%8:0
      return o
    },
    toString(byteSep=' ',colSep='\n'){
      for(i=r='';i<w;++i,r+=colSep)
        for(j=0;j<h;++j%8?r:r+=byteSep)
          r+=this.get(j,i)//TODO:why?
      return r
    },
    draw(){
      this.views.map(a=>a.draw())
    },
    commands:[],
    views:[],
    addView(v){
      this.views.push(v)
    },
    loadAscii(A){
      A.match(/0|1/g).map((a,i)=>this.set(~~a,i%w,i/w|0))
    }
  }
  Command=function(board){
    return{
      Paint:function(v,pxList=[]){
        return{
          board,
          v,
          undoList:[],
          pxList,
          do(){
            pxList.map(p=>board.set(v,p)^v&&this.undoList.push(p))
          },
          undo(){
            this.undoList.map(p=>board.set(!this.v,p))
          }
        }
      }
    }
  }
  View=function(board){
    function printBoard(){
      console.log(board.toString())
    }
    return{
      Canvas:function(c){
        x=c.getContext('2d')
        c.width=w
        c.height=h
        c.style.width=w*s+"px"
        c.style.height=h*s+"px"
        X=Y=cmd=-1
        c.onmousedown=e=>{
          b=e.buttons
          if(!b||b&2)return
          cmd=board.Command.Paint(b==1)
        }
        c.onmousemove=e=>{
          if(!e.buttons||e.buttons&2)return
          r=c.getBoundingClientRect()
          X=(e.x-r.left)*c.width/c.clientWidth|0
          Y=(e.y-r.top)*c.height/c.clientHeight|0
          x.fillStyle=e.buttons==4?"#FFF":"#000"
          x.fillRect(X,Y,1,1)
          console.log(board.get(X,Y)+'  '+X+' '+Y)
          console.log(cmd.pxList.push(X*w+Y))
        }
        c.onmouseup=e=>{
          cmd.do()
          board.draw()
        }
        cv={
          c,
          board,
          draw(){
            console.log("a Canvas View draws")
            console.log(c)
            printBoard()
            for(i=w;i--;r+='\n')
              for(j=h;j--;x.fillRect(i,j,1,1))
                x.fillStyle=board.get(i,j)?"#000":"#fff"
          }
        }
        board.addView(cv)
        return cv
      },
      CSSBoxShadow:function(e){
        return{
          e,
          draw(){
            console.log("a CSSBoxShadow View draws")
          }
        }
      }
    }
  }
  board.View=View(board)
  board.Command=Command(board)
  return board
};



// (cc by-sa-nc) muriel machado 2020
robrot = `\
000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000
000000000000000000000110000011000000000000000000
000000000000000000000111000111100000000000000000
000000000000000100001101111101000011100000000000
000000000000001100001111111111000110100000000000
000000000000011110001110000111000101100000000000
000000000000110110011000000001111111000000000000
000000000000110110110011000000011110000000000000
000000000000110111110011000000000110000000000000
000000000000111111000111000000000011000000000000
000000000000111000000101000000000111100000000000
000000000111100000000111000000001111111100000000
000000000111000000000000000000001110110100000000
000000000101000000000000000000001010011100000000
000000000111000000000000000000001100011000000000
000000000010000000000010000000000000011000000000
000000000110000000000010000000000000011000000000
000000000110000000000111000000000000011000000000
000000001100000000000010000010000000001000000000
000000001100000000100000001100000000001100000000
000000001100000000011000011100000000001100000000
000000001100011000011000011000110000001100000000
000000001100000000000000000000000000000100000000
000000001100000000000000000110000000001100000000
000000000100000000011111111110000000011000000000
000000000110000000001111111000000000111000000000
000000000110000000000000000000000000110000000000
000000000011000000000000000000000000100000000000
000000000011100000000000100000000011100000000000
000000000001111100000000000000001111000000000000
000000000000001111100000000111111100000000000000
000000000000000011111111111111110000000000000000
000000000000000111111111111111000000000000000000
000000000000000100011111111001100000000000000000
000000000000001110001101100001100000000000000000
000000000000011110001101100100110001110000000000
000000000111110010001101001100111111110000000000
000000000110110010000111001100011010010000000000
000000000110010011000110001100000010010000000000
000000000011010011000100011100000010110000000000
000000000011110011000100011100000011111000000000
000000001111111111100100011111111111111000000000
000000000111111111111111111111111111100000000000
000000000000011111111111111111111100000000000000
000000000000000000011111111100000000000000000000
000000000000000000000111100000000000000000000000
000000000000000000000000000000000000000000000000`
console.log(robrot)



b1=BBoard(48,48)
// b2=BBoard(32,32)
// b3=new BBoard(42,42)
// b4=new BBoard(16,16)

b1.View.Canvas(c)
b1.loadAscii(robrot)
b1.set(1,2,4)
c1=b1.Command.Paint(1,[5,8,16,17,2*48+4])
b1.draw()

// b3.set(1,2,14)
// v3=new b3.View.Canvas(0)
// b3.draw()

// v3.draw=function(){
//   console.log("a modified Canvas View draws")
//   console.log(c)
//   console.log(this.board.toString().replace(/0/g,'_')) 
// }
// b3.draw()

