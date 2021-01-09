// // deve aparecer uma reta.
// //
// // Se o usuário pressionar o mouse sobre um dos cantos, aquele canto da reta será movido enquanto o outro canto da reta fica fixo.
// //
// // Se o mouse for pressionado no centro da reta, a reta toda deve ser movida.
// //
// //
// //
// // Ao clicar com o botão da direita do mouse, os dois cantos da reta ficam fixos e a reta é dividida em duas.
// //
// // Um extremo em cada ponto fixo e um extremo no local do mouse.
// //
// //
// //  O aplicativo deve solicitar um número (entre 3 e 8) e gerar um polígono com aquele número de lados. A cada segmento de reta, as duas ações descritas acima devem operar.
// //  Por exemplo, é possível tranformar um triângulo em quadrado ao pressionar com o botão da direita em uma das retas do triângulo.
//
// canvas vars
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;
function reOffset(){
    var BB=canvas.getBoundingClientRect();
    offsetX=BB.left;
    offsetY=BB.top;
}
var offsetX,offsetY;
reOffset();
window.onscroll=function(e){ reOffset(); }
window.onresize=function(e){ reOffset(); }

// dragging vars
var isDown=false;
var rightClick=false;

var startX,startY;

// line vars
var nearest;
var lines=[];
lines.push({x0:75, y0:25, x1:125,y1:25}); //MAKE SURE 0 IS THE MINIMAL NUMBER
draw();

// listen for mouse events
$("#canvas").mousedown(function(e){handleMouseDown(e);});
$("#canvas").mousemove(function(e){handleMouseMove(e);});
$("#canvas").mouseup(function(e){handleMouseUpOut(e);});
$("#canvas").mouseout(function(e){handleMouseUpOut(e);});
//botao direito

// functions
//////////////////////////

// select the nearest line to the mouse
function closestLine(mx,my){
    var dist=100000000;
    var index,pt;

    index = isLine(lines, mx, my)
    var line=lines[index];
    if (rightClick == false){
      sec = whichSection(line,mx,my)
      return({ pt:{x:mx, y:my}, ptMove:sec, line:line, originalLine:{x0:line.x0,y0:line.y0,x1:line.x1,y1:line.y1} });
    }
    else{
      inRightClick(line,mx,my)
      lines.splice(index, 1);
    }

    // return -1
}

// linear interpolation -- needed in setClosestLine()
function lerp(a,b,x){return(a+x*(b-a));}

function findSection(a, b) {

  res = (( b - a)* 0.3333);
  console.log(res)
  return (res)
}

function isInsideInterval(a, b, x){
  console.log(a, b, x)
  if ((x >= a-5) && (x <= b+5)){
    return true;
  }
  else {
    return false;
  }
}

// find which section of the line the mouse clicked, in the points or middle
function whichSection(line,mx,my){
  console.log(mx, my, line)
    sectionX = findSection(line.x0, line.x1);
    sectionY = findSection(line.y0, line.y1);

    //make three sections left middle and right on the line
    var secLeftX = line.x0 + sectionX;
    var secMiddleX = secLeftX + sectionX;
    var secRightX = secMiddleX + sectionX;

    var secLeftY = line.y0 + sectionY;
    var secMiddleY = secLeftY + sectionY;
    var secRightY = secMiddleY + sectionY;

    if (isInsideInterval(line.x0, secLeftX, mx) && isInsideInterval(line.y0, secLeftY, my)){ //right
      console.log("left");
      return("left");
    }
    else if (isInsideInterval(secLeftX, secMiddleX, mx) && isInsideInterval(secLeftY, secMiddleY, my)) {
      console.log("middle");
      return("middle");
    }
    else if (isInsideInterval(secMiddleX,secRightX, mx) && isInsideInterval(secMiddleY,secRightY, my)) {
      console.log("right")
      return("right")
    }

}

function isLine(lines,mx,my){
  for(var i=0;i<lines.length;i++){ //esta em alguma linha

    if ((mx >= lines[i].x0-5) && (mx <= lines[i].x1+5) && (my >= lines[i].y0-5) && (my <= lines[i].y1+5)){
      return i;
    }

  }

  return -1;
}

function getMiddle(a, b, x){
    return (((b-a)/2)+x);
}

function inRightClick(line,mx,my){

  middleX = getMiddle(line.x0,line.x1,line.x0)
  middleY = getMiddle(line.y0,line.y1,line.y0)

  lines.push({x0:line.x0, y0:line.y0, x1:middleX-3,y1:middleY-3}); //MAKE SURE 0 IS THE MINIMAL NUMBER
  lines.push({x0:middleX+3, y0:middleY+3, x1:line.x1,y1:line.y1});
  console.log(lines)
  rightClick = false;

}
// draw the scene
function draw(){
    ctx.clearRect(0,0,cw,ch);
    // draw all lines at their current positions
    for(var i=0;i<lines.length;i++){
        drawLine("",lines[i],'black');
    }
    // draw markers if a line is being dragged
    if(nearest){
        // point on line nearest to mouse
        ctx.beginPath();
        ctx.arc(nearest.pt.x,nearest.pt.y,5,0,Math.PI*2);
        ctx.strokeStyle='red';
        ctx.stroke();
        // marker for original line before dragging
        drawLine(nearest.ptMove,nearest.originalLine,'red');
        // hightlight the line as its dragged
        drawLine(nearest.ptMove,nearest.line,'red');
    }
}

function drawLine(section,line,color){
    ctx.beginPath();
    ctx.moveTo(line.x0,line.y0);
    ctx.lineTo(line.x1,line.y1);
    ctx.lineWidth = "4";
    ctx.strokeStyle=color;
    ctx.stroke();
}

function handleMouseDown(e){
  // tell the browser we're handling this event

  e.preventDefault();
  e.stopPropagation();
  // mouse position
  startX=parseInt(e.clientX-offsetX);
  startY=parseInt(e.clientY-offsetY);

  if (e.button == 2){
    rightClick = true;
  }
  else {
    rightClick = false;
  }
  // find nearest line to mouse
  nearest=closestLine(startX,startY);
  draw();
  // set dragging flag
  isDown=true;
}

function handleMouseUpOut(e){
  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();
  // clear dragging flag
  isDown=false;
  nearest=null;
  draw();
}

function handleMouseMove(e){

      if(!isDown){return;}
      // tell the browser we're handling this event
      e.preventDefault();
      e.stopPropagation();
      // mouse position
      mouseX=parseInt(e.clientX-offsetX);
      mouseY=parseInt(e.clientY-offsetY);
      // calc how far mouse has moved since last mousemove event
      var dx=mouseX-startX;
      var dy=mouseY-startY;
      startX=mouseX;
      startY=mouseY;
      // change nearest line vertices by distance moved

      var line=nearest.line;
      if(nearest.ptMove == "middle"){
        line.x0+=dx;
        line.y0+=dy;
        line.x1+=dx;
        line.y1+=dy;
      }
      else if (nearest.ptMove == "left"){
        line.x0+=dx;
        line.y0+=dy;
        // line.x1+=dx;
        // line.y1+=dy;
      }
      else if (nearest.ptMove == "right"){
        // line.x0+=dx;
        // line.y0+=dy;
        line.x1+=dx;
        line.y1+=dy;
      }

    // redraw
    draw();
}
