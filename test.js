var canvas = document.getElementById("myCanvas");
//var pdImg = document.getElementById("pd");
var hjImg = document.getElementById("hj");
var ctx = canvas.getContext("2d");
/*		
	ctx.beginPath();
	ctx.rect(20, 40, 50, 50);
	ctx.fillStyle = "#FF0000";
	ctx.fill();
	ctx.closePath();
		
		
	ctx.beginPath();
		ctx.arc(240, 160, 20, Math.0, Math.PI*2);
		ctx.fillStyle = "green";
		ctx.fill();
		ctx.closePath();
	
		ctx.beginPath();
		ctx.rect(160, 10, 100, 40);
		ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
		ctx.stroke();
		ctx.closePath(); */
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var ballColors = new Array("#111111","#66CCAA","#EE95DD","#0095DD");
var ballColor = ballColors[3];
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 20;
var brickOffsetLeft = 20;
var score = 0;
var lives = 13;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1  };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > paddleWidth/2 && relativeX < canvas.width - paddleWidth/2) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
			if(b.status == 1){
				if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
					dy = -dy;
					ballColor = ballColors[Math.round(Math.random()*3)];
					b.status = 0;
					score++;
					 
					if(score == brickRowCount*brickColumnCount + 1) {
						  alert("YOU WIN, CONGRATULATIONS!");
						  document.location.reload();
						  // clearInterval(interval); // Needed for Chrome to end game
					}

				}
			}
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 18);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 18);
}

function drawBall() {
	
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = ballColor;
	ctx.fill();
	ctx.closePath();
	
	ctx.drawImage(hjImg, x-10, y-10, 20, 20);
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
	
	//ctx.drawImage(pdImg, paddleX, canvas.height-paddleHeight);
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
			if(bricks[c][r].status == 1) {
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
				
				ctx.drawImage(hjImg, brickX, brickY, 20, 20);
			}
        }
    }
}
			
function draw() {
	
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();	
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();
	
//检测是否碰到墙壁	

if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
	ballColor = ballColors[Math.round(Math.random()*3)];
}//左右

if( y + dy < ballRadius) {//上
    dy = -dy;
	ballColor = ballColors[Math.round(Math.random()*3)];
	
}
//穿过下面墙结束
else if(y > canvas.height ){
		// alert("Game Over!");
		//单击提示按钮后,document.location.reload（）函数将重新加载页面并重新开始游戏。
		//document.location.reload();
		//clearInterval(interval);
			
		lives--; 
		if(!lives) {
			alert("GAME OVER");
			document.location.reload();
		//	clearInterval(interval); // Needed for Chrome to end game
		}
		else {
			x = canvas.width/2;
			y = canvas.height-30;
			dx = 2;
			dy = -2;
			paddleX = (canvas.width-paddleWidth)/2;
		}
}
//paddle高度忽略时（与paddle上面可能碰撞）
/* else if(y + dy > canvas.height-ballRadius) {//球下面是否将要碰到paddle
    if(x > paddleX && x < paddleX + paddleWidth) {//碰到
      dy = -dy;
	  ballColor = ballColors[Math.round(Math.random()*3)];
    }
    
} */


//paddle高度没有忽略时（比较复杂，与paddle上面侧面都可能碰撞）
else if(y + dy > canvas.height - paddleHeight - ballRadius){//快要或已经碰到上面
	//暂时无paddle顶点相碰（paddle瞬时移动球进入其中后，如下代码导致出现球每步都上下换方向而跳动）
	if(x > paddleX && x < paddleX + paddleWidth){//碰到上面
		dy = -dy;
		ballColor = ballColors[Math.round(Math.random()*3)];
	}
	//paddle与球碰撞时根据两者速度方向分为正面和背面碰撞	
	//根据速度不同分为
	else if(x <= paddleX - ballRadius){//paddle左边，如果可以阻塞在这一直检测也许可以
		if(dx > 0){
			if(x + dx > paddleX - ballRadius ){		
				dx = -dx * 1.3;		
				ballColor = ballColors[Math.round(Math.random()*3)];
			}
		}else{
			if(x == paddleX -ballRadius ){	
				dx = dx * 1.3;		
				ballColor = ballColors[Math.round(Math.random()*3)];
			}
		}
		
	}
	else if(x >= paddleX + paddleWidth + ballRadius){//paddle右边
		if(dx < 0){
			if(x + dx < paddleX + paddleWidth + ballRadius){	
				dx = -dx * 1.3;		
				ballColor = ballColors[Math.round(Math.random()*3)];
			}
		}else{
			if(x == paddleX + paddleWidth + ballRadius){
				dx = dx * 1.3;		
				ballColor = ballColors[Math.round(Math.random()*3)];
			}
		}
	
	}
	
	
	/* else if((x + dx > paddleX - ballRadius && x < paddleX - ballRadius + 30)||(x + dx < paddleX + paddleWidth + ballRadius && x > paddleX + paddleWidth + ballRadius - 30)){//碰到侧面
			dx = -dx * 2;		
			ballColor = ballColors[Math.round(Math.random()*3)];		
	} */
} 

/* else if(y + dy > canvas.height - paddleHeight - ballRadius){//快要（去掉dy后<）或已经（去掉dy后>=）碰到上面
	if(y < canvas.height ){
		if(x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius){
			if(x > paddleX && x < paddleX + paddleWidth ){
				dy = -dy;
				y -= 10;
				ballColor = ballColors[Math.round(Math.random()*3)];
			}else{//碰到侧面		
				dx = -dx;
				if(dx > 0){
					x -= ballRadius;
				}else{
					x += ballRadius;
				}
				ballColor = ballColors[Math.round(Math.random()*3)];
			}
		}
	}else{//穿过下墙
		// alert("Game Over!");
		//单击提示按钮后,document.location.reload（）函数将重新加载页面并重新开始游戏。
		//document.location.reload();
		//clearInterval(interval);
			
		lives--; 
		if(!lives) {
			alert("GAME OVER");
			document.location.reload();
		//	clearInterval(interval); // Needed for Chrome to end game
		}
		else {
			x = canvas.width/2;
			y = canvas.height-30;
			dx = 2;
			dy = -2;
			paddleX = (canvas.width-paddleWidth)/2;
		}
	}
} */

	
//上下
	
if(rightPressed) {
    paddleX += 6;
    if (paddleX + paddleWidth > canvas.width){
        paddleX = canvas.width - paddleWidth;
    }
}
else if(leftPressed) {
    paddleX -= 6;
    if (paddleX < 0){
        paddleX = 0;
    }
}	
	
x += dx;
y += dy

requestAnimationFrame(draw);
}

draw();

/*
现在，draw（）函数在requestAnimationFrame（）循环中一次又一次地执行，将帧速率的控制权交还给浏览器，而不是固定的10毫秒帧速率。它将相应地同步帧速率并仅在需要时渲染形状。与旧的setInterval（）方法相比，这将产生更有效，更流畅的动画循环。

*/
//var interval = setInterval(draw, 10);