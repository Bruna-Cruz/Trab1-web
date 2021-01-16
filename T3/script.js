// canvas vars
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;

function reOffset(){
    var bc=canvas.getBoundingClientRect();
    offsetX=bc.left;
    offsetY=bc.top;
}
var offsetX,offsetY;
reOffset();
window.onscroll=function(e){ reOffset(); }
window.onresize=function(e){ reOffset(); }

// dragging and divede line vars
var isDown=false;
var rightClick=false;

var startX,startY;

// line vars
var selected;
var lines=[];

lines.push({x0:75, y0:25, x1:350,y1:25});
draw();

//mouse events inside canvas
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUpOut);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseout', handleMouseUpOut);


function difference(a, b) {
  return Math.abs(a - b);
}

//generate polygon based on corners chose by user
function generatePolygon (){

  // var corners = parseInt(document.getElementById("corners").value);
  var value = $("#corners").val();
  // var corners = parseInt(document.getElementById("corners").value);
  var corners= parseInt(value)
  if(corners == 0 )
    return;
  lines=[];

  //angle of pts based on number of corners choosen
  var angle = (Math.PI * 2) / corners;

  // points
  var pts = [];
  var radius = 1;

  for (var i=0; i<corners; i++) {
      var a = angle * i;
      var x = (Math.sin(a)*radius);
      var y = (Math.cos(a)*radius);
      pts.push({
        x:x,
        y:y
      })
      //add lines
      lines.push(({}));
  }
  //angle of a side
  var sideangle = Math.atan2(pts[1].y-pts[0].y, pts[1].x-pts[0].x);
  var nPoints = pts.length;

  //rotate point based on the bottom one
  for (var i=1; i<nPoints; i++){
    pts[i] = {
        x:Math.cos(sideangle) * (pts[i].x - pts[0].x) - Math.sin(sideangle) * (pts[i].y-pts[0].y) + pts[0].x,
        y:Math.sin(sideangle) * (pts[i].x - pts[0].x) + Math.cos(sideangle) * (pts[i].y-pts[0].y) + pts[0].y
    };
  }

  //rectangle size
  var rect = {left:2,top:2,right:-2,bottom:-2};
  for (var i=0; i<nPoints; i++){
    rect.left = Math.min(rect.left,pts[i].x);
    rect.top = Math.min(rect.top,pts[i].y);
    rect.bottom = Math.max(rect.bottom,pts[i].y);
    rect.right = Math.max(rect.right,pts[i].x);
  }
  rect.width = difference(rect.right,rect.left);
  rect.height = difference(rect.bottom,rect.top);

  //points relative to top left of rect
  for (var i=0; i<nPoints; i++){
      pts[i] = {
          x: pts[i].x - rect.left,
          y: pts[i].y - rect.top
      };
  }

  //scale and position the polygon based on the rectangle
  var ratio = Math.min((cw / rect.width), (cw / rect.height));
  for (var i=0; i<nPoints; i++){
    pts[i] = {
      x: (pts[i].x * ratio),
      y: (pts[i].y * ratio)
    };
  }

  //transforme pts in lines
  lines[0].x0 = pts[nPoints-1].x;
  lines[0].y0 = pts[nPoints-1].y;
  lines[0].x1 = pts[0].x;
  lines[0].y1 = pts[0].y;

  for (var i=1; i<nPoints; i++){
    lines[i].x0 = pts[i-1].x;
    lines[i].y0 = pts[i-1].y;
    lines[i].x1 = pts[i].x;
    lines[i].y1 = pts[i].y;
  }
  //draw lines
  draw();
}

// select the selected line to the mouse
function selectedLine(mx,my){
    var dist=100000000;
    var index,pt;

    index = isLine(lines, mx, my)
    if (index == -1)
      return
    var line=lines[index];
    if (rightClick == false){
      sec = whichSection(line,mx,my)
      return({ pt:{x:mx, y:my}, ptMove:sec, line:line, oldLine:{x0:line.x0,y0:line.y0,x1:line.x1,y1:line.y1} });
    }
    else{
      inRightClick(line,mx,my)
      lines.splice(index, 1);
    }

    return -1
}

// find which section of the line the mouse clicked, in the pts or middle
function whichSection(line,mx,my){
  // console.log(mx, my, line)
  var smaller, bigger;
  //response telling if the mouse click is near the smaller, middle or bigger point (x or y)
  var res ={
    sec: "", //witch section of the line the click is closest to
    pt_s: "" //witch is smaller
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

//checks if the mouse is on the line or next to returns the line
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

//divide line in the middle on right click
function inRightClick(line,mx,my){

  middleX = getMiddle(line.x0,line.x1,line.x0)
  middleY = getMiddle(line.y0,line.y1,line.y0)

  lines.push({x0:line.x0, y0:line.y0, x1:middleX-3,y1:middleY-3});
  lines.push({x0:middleX+3, y0:middleY+3, x1:line.x1,y1:line.y1});
  rightClick = false;

}
// draw the scene
function draw(){
  ctx.clearRect(0,0,cw,ch);
  // draw all lines at their current positions
  for(var i=0;i<lines.length;i++){
      drawLine("",lines[i],'lightcoral');
  }
  // draw markers if a line is being dragged
  if(selected){
      // point on line selected
      ctx.beginPath();
      ctx.arc(selected.pt.x,selected.pt.y,5,0,Math.PI*2);
      ctx.strokeStyle='gray';
      ctx.stroke();
      // marker for original line before dragging
      drawLine(selected.ptMove,selected.oldLine,'gray');
      // hightlight the line as its dragged
      drawLine(selected.ptMove,selected.line,'gray');
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

  //checks if it is right click
  if (e.button == 2){
    rightClick = true;
  }
  else {
    rightClick = false;
  }

  // find selected line to mouse
  selected=selectedLine(startX,startY);

  //checks if the line was selected and draw it if it is
  if (selected != -1)
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
  selected=null;
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
  // change selected line vertices by distance moved

  if (selected == undefined)
    return
  var line=selected.line;

  if(selected.ptMove.sec == "middle"){ //move entire line
    line.x0+=dx;
    line.y0+=dy;
    line.x1+=dx;
    line.y1+=dy;
  }
  else if (selected.ptMove.sec == "first section"){ // move the point with smaller numeber
    if(selected.ptMove.pt_s == "0"){
      line.x0+=dx;
      line.y0+=dy;
    }
    else{
      line.x1+=dx;
      line.y1+=dy;
    }
  }
  else if (selected.ptMove.sec == "third section"){ // move the point with bigger numeber
    if(selected.ptMove.pt_s == "0"){
      line.x1+=dx;
      line.y1+=dy;
    }
    else{
      line.x0+=dx;
      line.y0+=dy;
    }
  }

  // redraw
  draw();
}
