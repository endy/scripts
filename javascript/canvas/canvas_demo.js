
function Position()
{
    this.x = 0;
    this.y = 0;
}

function Rect()
{
    this.top    = 0;
    this.left   = 0;
    this.bottom = 0;
    this.right  = 0;
}

function Actor()
{
    this.pos = new Position();
    this.img = 0;

    this.draw = function (ctx)
    {
        ctx.drawImage(this.img, this.pos.x, this.pos.y);
    }
}


function Ball()
{
    this.pos = new Position();
    this.img = new Image();
    this.owner = 0;

    this.draw = function (ctx)
    {
        ctx.drawImage(this.img, this.pos.x, this.pos.y); 
    }
}

// App Data
var gCanvas;
var mouseX = 0;
var mouseY = 0;

var gBallImage = 0;
var gBubImage = 0;

// Game Data
var gBounds;
var gPlayer = new Actor();
var gPet = new Actor();
var gBall = new Ball();



function onMouseMove(e)
{
    var rect = gCanvas.getBoundingClientRect();
    mouseX = e.pageX - rect.left;
    mouseY = e.pageY - rect.top;
}

function gameUpdate()
{
    gBall.pos.x = mouseX - gBallImage.width/2;
    gBall.pos.y = mouseY - gBallImage.height/2
}


function drawUpdate()
{
    if (gCanvas && gCanvas.getContext)
    {
        var ctx = gCanvas.getContext('2d');
        if (ctx)
        {
            ctx.clearRect(0,0,gCanvas.width,gCanvas.height);

            gBall.draw(ctx);
            gPet.draw(ctx);
            
            // draw bounds rect
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, gCanvas.width, 5);
            ctx.fillRect(0, gCanvas.height-5, gCanvas.width, 5);
            ctx.fillRect(0, 0, 5, gCanvas.height);
            ctx.fillRect(gCanvas.width-5, 0, 5, gCanvas.height);
        }
    }
}

function update()
{
    gameUpdate();
    drawUpdate();
}

function startGame()
{
    gCanvas = document.getElementById('gameScreen');

    gCanvas.onmousemove=onMouseMove;

    gBubImage = new Image();
    gBubImage.src = "lilbub.png";

    gBallImage = new Image();
    gBallImage.src = "ball.png";

    gPet = new Actor();
    gPet.img = gBubImage;

    gBall = new Ball();
    gBall.img = gBallImage;

    gPlayer = new Actor();

    var borderThickness = 5;

    gBounds = new Rect();
    gBounds.top = 5;
    gBounds.left = 5;
    gBounds.right = gCanvas.width - 5;
    gBounds.bottom = gCanvas.height - 5;

    setInterval(update, 10);    
}

