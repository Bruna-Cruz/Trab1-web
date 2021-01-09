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
function difference(a, b) {
  return Math.abs(a - b);
}
function isInsideInterval(a, b, x){
  console.log(a, b, x)
  if ((x >= a-5) && (x <= b)){
    return true;
  }
  else {
    return false;
  }
}

// find which section of the line the mouse clicked, in the points or middle
function whichSection(line,mx,my){
  console.log(mx, my, line)
  var smaller, bigger;
  var smallerY, smallerY

  var res ={
    sec: "",
    pt_s: ""
  };

  sizeX = difference(line.x0, line.x1);
  sizeY = difference(line.y0, line.y1);

  if (sizeX > sizeY){

    if ((line.x0 <= line.x1) ){
      smaller = line.x0;
      bigger = line.x1;
      res.pt_s = "0";
    }
    else{
      smaller = line.x1;
      bigger = line.x0;
        res.pt_s = "1";
    }


    middle = ((difference(smaller, bigger) / 2) + smaller);

    var smallerDist;

    var dist1 = difference(mx, smaller);
    var distMiddle = difference(mx, middle);
    var dist2 = difference(mx, bigger);

    if( (dist1 <= distMiddle) && (dist1 <= dist2)){
      res.sec = "first section";
    } else if ((distMiddle <= dist1) && (distMiddle <= dist2)) {
      res.sec = "middle";
    } else if ((dist2 <= dist1) && (dist2 <= distMiddle )){
      res.sec = "third section";
    }
    return res

  } else {

    if ((line.y0 <= line.y1) ){
      smaller = line.y0;
      bigger = line.y1;
      res.pt_s = "0";

    }
    else{
      smaller = line.y1;
      bigger = line.y0;
      res.pt_s = "1";
    }

    middle = ((difference(smaller, bigger) / 2) + smaller);

    var smallerDist;

    var dist1 = difference(my, smaller);
    var distMiddle = difference(my, middle);
    var dist2 = difference(my, bigger);

    if( (dist1 <= distMiddle) && (dist1 <= dist2)){
      res.sec = "first section";
    } else if ((distMiddle <= dist1) && (distMiddle <= dist2)) {
      res.sec = "middle";
    } else if ((dist2 <= dist1) && (dist2 <= distMiddle )){
      res.sec = "third section";
    }
    return res
  }



}

function isLine(lines,mx,my){
  for(var i=0;i<lines.length;i++){
    //menor num e maior num
    var x0, x1, y0, y1;

    if (lines[i].x0 <= lines[i].x1){
      x0 = lines[i].x0-3;
      x1 = lines[i].x1+3;
    }
    else{
      x0 = lines[i].x1-3;
      x1 = lines[i].x0+3;
    }
    if (lines[i].y0 <= lines[i].y1){
      y0 = lines[i].y0-3;
      y1 = lines[i].y1+3;
    }
    else{
      y0 = lines[i].y1-3;
      y1 = lines[i].y0+3;
    }

    if ((mx >= x0) && (mx <= x1) && (my >= y0) && (my <= y1)){
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
        drawLine("",lines[i],'gray');
    }
    // draw markers if a line is being dragged
    if(nearest){
        // point on line nearest to mouse
        ctx.beginPath();
        ctx.arc(nearest.pt.x,nearest.pt.y,5,0,Math.PI*2);
        ctx.strokeStyle='lightcoral';
        ctx.stroke();
        // marker for original line before dragging
        drawLine(nearest.ptMove,nearest.originalLine,'lightcoral');
        // hightlight the line as its dragged
        drawLine(nearest.ptMove,nearest.line,'lightcoral');
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
      if(nearest.ptMove.sec == "middle"){ //move entire line
        line.x0+=dx;
        line.y0+=dy;
        line.x1+=dx;
        line.y1+=dy;
      }
      else if (nearest.ptMove.sec == "first section"){ // move the point with smaller numeber
        if(nearest.ptMove.pt_s == "0"){
          line.x0+=dx;
          line.y0+=dy;
          // line.x1+=dx;
          // line.y1+=dy;
        }
        else{
          line.x1+=dx;
          line.y1+=dy;
        }
      }
      else if (nearest.ptMove.sec == "third section"){ // move the point with bigger numeber
        if(nearest.ptMove.pt_s == "0"){
          line.x1+=dx;
          line.y1+=dy;

          // line.x1+=dx;
          // line.y1+=dy;
        }
        else{
          line.x0+=dx;
          line.y0+=dy;
        }
      }

    // redraw
    draw();
}
