// GPLv3 marcos assis 2020

BBoard=function(w,h,s=8,buf=new Uint8ClampedArray(w*h/8)){
  let board={
    get width(){
      return w
    },
    get height(){
      return h
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
      for(i=0,r='';i<h;++i,r+=colSep)
        for(j=0;j<w;++j%8?r:r+=byteSep)
          r+=this.get(i,j)
      return r
    },
    loadAscii(A){
      A.match(/0|1/g).map((a,i)=>this.set(~~a,i))
    },
    views:[],
    addView(v){
      this.views.push(v)
    },
    draw(){
      this.views.map(a=>a.draw())
    },
    setDrawPixel(v,p,q){
      o=this.set(v,p,q)
      v^o&&this.views.map(a=>a.drawPixel(v,p,q))
      return o
    },
    history:{
      done:[],
      undone:[],
      get last(){
        return this.done[this.done.length-1]
      },
      add(cmd){
        this.done.push(cmd)
        this.undone=[]
      },
      removeLast(){
        this.done.pop()
      },
      undo(){
        if(cmd=this.done.pop()){
          this.undone.push(cmd)
          cmd.undo()
        }
      },
      redo(){
        if(cmd=this.undone.pop()){
          this.done.push(cmd)
          cmd.redo()
        }
      },
    }
  }
  let Command=function(board){
    return{
      Paint:function(v){
        let cmd={
          board,
          v,
          pxList:[],
          add(p,q){
            board.setDrawPixel(v,p,q)^v&&this.pxList.push(p*w+q)
          },
          do(){
            if(this.pxList.length==0)board.history.removeLast()
          },
          undo(){
            this.pxList.map(p=>board.setDrawPixel(!this.v,p/w|0,p%w))
          },
          redo(){
            this.pxList.map(p=>board.setDrawPixel(this.v,p/w|0,p%w))
          }
        }
        board.history.add(cmd)
        return cmd
      }
    }
  }
  let View=function(board){
    return{
      Canvas:function(c){
        x=c.getContext('2d')
        c.width=w
        c.height=h
        c.style.width=w*s+"px"
        c.style.height=h*s+"px"
        cv={
          c,
          board,
          drawPixel(v,p,q){
            x.fillStyle=v?"#000":"#fff"
            x.fillRect(q,p,1,1)
          },
          draw(){
            for(i=h;i--;)
              for(j=w;j--;)
                this.drawPixel(board.get(i,j),i,j)
          }
        }
        board.addView(cv)
        return cv
      },
      ConsoleLog:function(){
        cl={
          board,
          drawPixel(v,p,q){
            console.log(p+' '+q+' : '+v)
          },
          draw(){
            console.log(board.toString())
          }
        }
        board.addView(cl)
        return cl
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
  let InputArea=function(board){
    return{
      Canvas:function(c){
        let cmd=0
        c.onmousedown=c.onmousemove=e=>{
          b=e.buttons
          if(!b||b&2)return
          cmd=cmd||board.Command.Paint(b==1)
          r=c.getBoundingClientRect()
          X=(e.x-r.left)*c.width/c.clientWidth|0
          Y=(e.y-r.top)*c.height/c.clientHeight|0
          cmd.add(Y,X)
        }
        c.onmouseup=c.onmouseleave=e=>{
          cmd&&cmd.do()
          cmd=0
        }
        document.onkeydown=e=>{
          cmd=0
          if(e.ctrlKey)
            if(e.key=='z')
              board.history.undo()
            else if(e.key=='y')
              board.history.redo()
        }
      }
    }
  }
  let imgPro=new Proxy(board,{
    get(t1,p){
      return new Proxy(t1,{
        get(t,q){
          return t.get(p|0,q|0)
        },
        set(t,q,v){
          return t.set(v,p|0,q|0)
        }
      })
    }
  })
  board.image=imgPro
  board.View=View(board)
  board.InputArea=InputArea(board)
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


b1=BBoard(48,48)
b2=BBoard(32,32)
b3=new BBoard(47,42)
b4=new BBoard(16,16)

b3.set(1,2,14)
v3=new b3.View.ConsoleLog()
b3.loadAscii(robrot)
v3.draw=function(){
  console.log("a modified View draws:")
  console.log(this.board.toString().replace(/0/g,'_')) 
}
//b3.draw()

b1.View.Canvas(c)
b1.View.ConsoleLog()
b1.InputArea.Canvas(c)
b1.loadAscii(robrot)
b1.set(1,2,4)
b1.image[2][4]=0
b1.draw()

console.log(robrot.replace(/0/g,' '))