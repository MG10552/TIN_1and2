var PUCK = 'puck';
var MALLET = 'mallet';

// Player 1 on the left, player 2 on the right
var PLAYER1 = 1;
var PLAYER2 = 2;

var myID = 0;

var numPucks, player1Score, player2Score;

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var mouseId = 'mouse';

// Keys are touch identifiers (or mouseID)
// Values are circle objects
var circlesBeingMoved = {};

var puckRadius = 20;
var malletRadius = 40;
var sidelineMargin = puckRadius * 2 + 5.5;

var goalWidth = 150;
var goalDepth = 10;

var dampeningFactor = 0.99;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var centerX = canvas.width / 2;
var centerY = canvas.height / 2;

var circles = [];

var socket = io();
//var socket = io.connect();


function resetGame(){
  circles = [
    {
      type: PUCK,
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: puckRadius,
      velocity: {x:0, y:0}
    },
    {
      type: MALLET,
      player: PLAYER1,
      x: canvas.width * 1 / 4,
      y: canvas.height / 2,
      radius: malletRadius,
      velocity: {x:0, y:0}
    },
    {
      type: MALLET,
      player: PLAYER2,
      x: canvas.width * 3 / 4,
      y: canvas.height / 2,
      radius: malletRadius,
      velocity: {x:0, y:0}
    }
  ];
  numPucks = 7;
  player1Score = 0;
  player2Score = 0;
}

function executeFrame(){
  requestAnimFrame(executeFrame);
  iterateSimulation();
  c.clearRect(0, 0, canvas.width, canvas.height);
  drawCourt();
  drawCircles();
}

function drawCircleObject(circle){
  drawCircle(circle.x, circle.y, circle.radius);
}

function drawCircle(x, y, radius){
  c.beginPath();
  c.arc(x, y, radius, 0, 2 * Math.PI);
  c.fill();
}

function drawLine(x1, y1, x2, y2){
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}

function drawCourt(){
  var y1 = sidelineMargin;
  var y2 = canvas.height - sidelineMargin;
  
  //points recorder line
  drawLine(0, y1, canvas.width, y1);
  
  //remaining pucks line
  drawLine(0, y2, canvas.width, y2);
  
  //middle line
  drawLine(centerX, y1, centerX, y2);
  
  //draw player 1 goal on the left side
  c.strokeRect(0, centerY - goalWidth / 2, goalDepth, goalWidth);
  
  //draw player 2 goal on the right side
  c.strokeRect(canvas.width - goalDepth, centerY - goalWidth / 2, 
               goalDepth, goalWidth);
}

function drawCircles(){
  // Draw the mallets and the puck in play
  c.fillStyle = "black";
  var i, circle;
  for(i = 0; i < circles.length; i++)
    drawCircleObject(circles[i]);
  
  var n, xOffset, span;
  var puckSpacing = 2;
  
  // Draw the remaining pucks at the bottom
  n = numPucks - 1 - player1Score - player2Score;
  span = (n - 1) * (puckRadius * 2 + 2);
  xOffset = canvas.width / 2 - span / 2;
  drawRowOfCircles(n, xOffset, span, canvas.height - sidelineMargin / 2);

  /*socket.emit('Remaining pucks', n);
   socket.on('pucks left', function(data) {
       drawCircles()});*/
  
  // Draw the pucks scored by player 1
  n = player1Score;
  span = (n - 1) * (puckRadius * 2 + puckSpacing);
  xOffset = puckRadius + puckSpacing;
  drawRowOfCircles(n, xOffset, span, sidelineMargin / 2);
  
  /*socket.emit('player1Score', player1Score);
   socket.on('p1s', function(data) {
      drawCircles()});*/

  // Draw the pucks scored by player 2
  n = player2Score;
  span = (n - 1) * (puckRadius * 2 + puckSpacing);
  xOffset = canvas.width - span - puckRadius - puckSpacing;
  drawRowOfCircles(n, xOffset, span, sidelineMargin / 2);

  /*socket.emit('player2Score', player2Score);
   socket.on('p2s', function(data) {
       drawCircles()});*/
}

function drawRowOfCircles(n, xOffset, span, y){
  for(var i = 0; i < n; i++){
    if(n == 1)
      x = xOffset;
    else
      x = xOffset + span * (i / (n - 1));
    drawCircle(x, y, puckRadius);
  }
}

function isBehindGoal(circle){
  var behindLeftGoal = circle.x < - circle.radius;
  var behindRightGoal = circle.x > canvas.width + circle.radius;
  return behindLeftGoal || behindRightGoal;
}

function score(puck){
  // Count the score
  if(puck.x < centerX)
    player2Score++;
  else
    player1Score++;
  
  // Center the puck
  puck.x = centerX;
  puck.y = centerY;
  puck.velocity.x = 0;
  puck.velocity.y = 0;
  
  // Reset the game if necessary
  var gameHasBeenWon = (numPucks - player1Score - player2Score === 0);
  if(gameHasBeenWon){
    var winner = player1Score > player2Score ? 1 : 2;
    alert("Congratulations player " + winner+"!");
    resetGame();
  }
}

function iterateSimulation(){
  var circle;
  var y1 = sidelineMargin;
  var y2 = canvas.height - sidelineMargin;
  
  for(i = 0; i < circles.length; i++){
    if(myID === 2 && i === 0) continue;
    circle = circles[i];
    
    // if the circle is inside a goal,
    // then put it in the center
    if(isBehindGoal(circle))
      score(circle);
    
    // slows things down
    circle.velocity.x *= dampeningFactor;
    circle.velocity.y *= dampeningFactor;
    
    // Add velocity to position
    if(circle.type == PUCK){
      circle.x += circle.velocity.x;
      circle.y += circle.velocity.y;
    }
    
    // Make them bounce off the floor
    if(circle.y > y2 - circle.radius){
      circle.y = y2 - circle.radius;
      circle.velocity.y = - Math.abs(circle.velocity.y);
    }
    // bounce off ceiling
    if(circle.y < circle.radius + y1){
      circle.y = circle.radius + y1;
      circle.velocity.y = Math.abs(circle.velocity.y);
    }
    // bounce off right wall
    if(circle.x > canvas.width - circle.radius && isNotInGoal(circle)){
      circle.x = canvas.width - circle.radius;
      circle.velocity.x = -Math.abs(circle.velocity.x);
    }
    // bounce off left wall
    if(circle.x < circle.radius && isNotInGoal(circle)){
      circle.x = circle.radius;
      circle.velocity.x = Math.abs(circle.velocity.x);
    }

    // REPULSION between circles
    for(j = i + 1; j < circles.length; j++){
      circle2 = circles[j];
      var dx = circle2.x - circle.x;
      var dy = circle2.y - circle.y;
      var d = Math.sqrt(dx*dx + dy*dy);
      
      if(d < circle.radius + circle2.radius){
        if(d === 0)
          d = 0.1;
        var unitX = dx/d;
        var unitY = dy/d;
        
        var force = -2;
        
        var forceX = unitX * force;
        var forceY = unitY * force;
        
        circle.velocity.x += forceX;
        circle.velocity.y += forceY;
        
        circle2.velocity.x -= forceX;
        circle2.velocity.y -= forceY;
      }
    }
    if(myID === 1 && i === 0){
      socket.emit('I moved', [circle.x, circle.y, 0]);
    }
  }
}

function isNotInGoal(circle){
  var underGoalTop = circle.y - circle.radius > centerY - goalWidth / 2;
  var overGoalBottom = circle.y + circle.radius < centerY + goalWidth / 2;
  var isInGoal = underGoalTop && overGoalBottom;
  return !isInGoal;
}

function getCircleUnderPoint(x, y){
  var i, circle, dx, dy, distance;
  for(i = 0; i < circles.length;i++){
    circle = circles[i];
    dx = circle.x - x;
    dy = circle.y - y;
    distance = Math.sqrt(dx * dx + dy * dy);
    
    if(distance < circle.radius)
      return circle;
  }
  return undefined;
}

function pointDown(x, y, id){
  var circleUnderPoint = getCircleUnderPoint(x, y);
  if(circleUnderPoint && circleUnderPoint.type == MALLET && myID === circleUnderPoint.player)
    circlesBeingMoved[id] = circleUnderPoint;
}

canvas.addEventListener("mousedown", function(e){
  pointDown(e.clientX, e.clientY, mouseId);
});

canvas.addEventListener('touchstart',function(e){
  var i;
  for(i = 0; i < e.changedTouches.length; i++){
    var touch = e.changedTouches[i];
    pointDown(touch.pageX, touch.pageY, touch.identifier);
  }
});

function pointUp(id){
  if(circlesBeingMoved[id])
    delete circlesBeingMoved[id];
}

canvas.addEventListener("mouseup", function(e){
  pointUp(mouseId);
});

canvas.addEventListener("mouseout", function(e){
  pointUp(mouseId);
});

canvas.addEventListener('touchend',function(e){
  var i;
  for(i = 0; i < e.changedTouches.length; i++){
    var touch = e.changedTouches[i];
    pointUp(touch.identifier);
  }
});

function pointMove(x, y, id){
  var circle = circlesBeingMoved[id];
  if(circle){
    circle.x = x;
    circle.y = y;
    correctMalletPosition(circle);
    //console.log(x, y);//mallet move can be now displayed in the console
    
      socket.emit('I moved', [x,y, myID]);
      
      socket.on('player moved', function(data) {
       pointUpdate(data[0], data[1], data[2]);
    //console.log(x, y, id);
});
  }
}

function pointUpdate(x, y, id){
   var circle = circles[id];
   if(circle){
    circle.x = x;
    circle.y = y;
    correctMalletPosition(circle);
  }
}

function correctMalletPosition(circle){
  // Make sure mallets are on the correct side:
  // Player 1 on the left, player 2 on the right
  if(circle.type == MALLET){
    if(circle.player == PLAYER1){
      if(circle.x > centerX - malletRadius)
        circle.x = centerX - malletRadius;
    }
    else if(circle.player == PLAYER2){
      if(circle.x < centerX + malletRadius)
        circle.x = centerX + malletRadius;
    }
  }
}

canvas.addEventListener("mousemove", function(e){
  pointMove(e.clientX, e.clientY, mouseId);
  //
  socket.emit('mallet move', {x: e.clientX, y: e.clientY}); 
  //console.log(e.clientX, e.clientY);
});

canvas.addEventListener('touchmove',function(e){
  var i;
  for(i = 0; i < e.changedTouches.length; i++){
    var touch = e.changedTouches[i];
    pointMove(touch.pageX, touch.pageY, touch.identifier);
  }

  // This is to prevent the default scrolling behavior
  e.preventDefault();
});
  
resetGame();

// Start animation
executeFrame();

socket.on('refresh update', function(data) {
  MouseMover(data.x, data.y, data.puckId);
});

socket.on('show users', function(players) {
  console.log(JSON.stringify(players));
});

 document.querySelector('.login').classList.add('visible');

var playerName = document.getElementById('playerName');
var playerNameButton = document.getElementById('playerNameEnter');
var playerNameButtonHandler = function(event) {
  socket.emit('add user', playerName.value);
};

var createRoomAnchor = document.getElementById('createRoomAnchor');
var createRoomAnchorHandler = function(event) {
  document.querySelector('.create-room').classList.toggle('visible');
};

var createRoomName = document.getElementById('createRoomName');
var createRoomNameButton = document.getElementById('createRoomNameButton');
var createRoomNameHandler = function(event) {

  socket.emit('create room', createRoomName.value);
};

var takePlayerOneSpotAnchor = document.getElementById('player1');
var takePlayerOneSpotAnchorHandler = function(event) {
  socket.emit('take player spot', 'player1');
  myID = PLAYER1;
};

var takePlayerTwoSpotAnchor = document.getElementById('player2');
var takePlayerTwoSpotAnchorHandler = function(event) {
  socket.emit('take player spot', 'player2');
  myID = PLAYER2;
};

var joinRoomAnchor = document.querySelector('.roomList ul li');
var joinRoomAnchorHandler = function(event) {
  socket.emit('join room', this.id);
};

socket.on('validate user', function(enter) {
  if (enter) {
    document.getElementById('messagesForLogin').innerHTML = "";
    document.querySelector('.login').classList.toggle('visible');
    document.querySelector('.rooms').classList.toggle('visible');
  } else {
    document.getElementById('messagesForLogin').innerHTML = 'Name already is use, please pick other nick.';
  }
});

socket.on('validate room', function(enter) {
  if (enter) {
    document.getElementById('messagesForCreateRoom').innerHTML = "";
    document.querySelector('.create-room').classList.toggle('visible');
    document.querySelector('.rooms').classList.toggle('visible');
    document.querySelector('.game').classList.toggle('visible');
  } else {
    document.getElementById('messagesForCreateRoom').innerHTML = 'Room with such a name is already in the base. Pick other name.';
  }
});

socket.on('validate take player spot', function(data) {
  if (data.enter) {
    console.log(JSON.stringify(data));
    document.getElementById(data.playerSpot).innerHTML = data.username//
  } else {
    alert('Occupied or you already possess this spot');
  }
});

socket.on('validate join room', function(enter) {
  if (enter) {
    document.getElementById('messagesForCreateRoom').innerHTML = "";
    document.querySelector('.create-room').classList.toggle('visible');
    document.querySelector('.rooms').classList.toggle('visible');
    document.querySelector('.game').classList.toggle('visible');
  } else {
    alert('Already occupied');
  }
});

socket.on('show lobby members', function(data) {
  console.log("LOBBY MEMBERS: " + JSON.stringify(data));
});

// socket.broadcast.to(socket.playerRoom).emit('chunk data', {x: x, y: y})

var ulRoomList;

socket.on('show rooms', function(data) {
  ulRoomList = document.createElement('ul');
  var li;
  console.log(JSON.stringify(data));
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key].length < 2) {
        li = document.createElement('li');
        li.id = key;
        li.innerHTML = key;
        ulRoomList.appendChild(li);
        li.addEventListener('click', joinRoomAnchorHandler);
      }
    }
  }
  document.querySelector('.roomList').innerHTML = "";
  document.querySelector('.roomList').appendChild(ulRoomList);
});

/*
socket.on('player moved', function(data)){
  socket.broadcast.to(socket).emit(I moved, data);
});
*/

socket.on('take spot', function(data) {});
socket.on('start game', function(data) {});

//event 'click' reaction
playerNameButton.addEventListener('click', playerNameButtonHandler); 
createRoomNameButton.addEventListener('click', createRoomNameHandler);

createRoomAnchor.addEventListener('click', createRoomAnchorHandler);
takePlayerOneSpotAnchor.addEventListener('click', takePlayerOneSpotAnchorHandler);
takePlayerTwoSpotAnchor.addEventListener('click', takePlayerTwoSpotAnchorHandler);
