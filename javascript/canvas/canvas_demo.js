/*
 *  TODOs:
 *  1.  Add ball chase behavior to pet                                              -- DONE!
 *  2.  Add mouse tracking functionality (with visualization to start)              -- DONE!
 *  3.  Add throw ball throw ability (tracking & chasing ON/OFF based on throws)
 *  4.  Add enemies for pet to take out
 *  5.  Add multiple levels to sample behavior
 *  6.  Add different items to throw
 *  7.  Add curve matching to select alternate throws
 *
 * */


function Point(x, y)
{
    if (x === undefined)
        x = 0;
    if (y === undefined)
        y = 0;

    this.x = x;
    this.y = y;
}

function Vector(x, y)
{
    if (x === undefined)
        x = 0;
    if (y === undefined)
        y = 0;

    this.x = x;
    this.y = y;
}

function Rect(in_top, in_left, in_bottom, in_right)
{
    if (in_top === undefined)
        in_top = 0;
    if (in_left === undefined)
        in_left = 0;
    if (in_bottom === undefined)
        in_bottom = 0;
    if (in_right === undefined)
        in_right = 0;

    this.top    = in_top;
    this.left   = in_left;
    this.bottom = in_bottom;
    this.right  = in_right;

    this.overlapRect = function(r)
    {
        if ((this.top > r.bottom) ||
            (this.bottom < r.top) ||
            (this.left > r.right) ||
            (this.right < r.left))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    this.containsRect = function(r)
    {
        if ((this.top < r.top) && 
            (this.bottom > r.bottom) &&
            (this.left < r.left) &&
            (this.right > r.right))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    ///@todo optimize this
    this.intersectRect = function(r)
    {
        if (!this.containsRect(r) &&
            !r.containsRect(this) &&
            this.overlapRect(r))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

function MouseTracker(maxSamples, sampleRate)
{
    this.maxSamples = maxSamples;
    this.sampleCount = 0;
    this.nextSampleLoc = 0;

    this.sampleRate = sampleRate;
    this.dtLastSample = 0;

    this.samples = [];

    this.sample = function(mousePoint)
    {
        this.samples[this.nextSampleLoc] = mousePoint;
        this.nextSampleLoc += 1;

        if (this.sampleCount < this.maxSamples)
        {
            this.sampleCount += 1;
        }

        if (this.nextSampleLoc >= this.maxSamples)
        {
            this.nextSampleLoc = 0;   
        }
    }

    this.update = function(elapsedTime)
    {
        this.dtLastSample += elapsedTime;
        if (this.dtLastSample > this.sampleRate)
        {
            this.sample(new Point(mouseX, mouseY));
            this.dtLastSample = 0;
        }
    }

    this.draw = function(ctx)
    {
        if (this.sampleCount > 1)
        {
            var idx = (this.sampleCount == this.maxSamples) ? this.nextSampleLoc : 0;

            ctx.beginPath();
            ctx.moveTo(this.samples[idx].x, this.samples[idx].y);

            var count = this.sampleCount - 1;

            while (count > 0)
            {
                idx += 1;
                if (idx >= this.sampleCount)
                {
                    idx = 0;
                }

                ctx.lineTo(this.samples[idx].x, this.samples[idx].y);
                count -= 1;
                
            }

            ctx.stroke();
        }     
    }
}

function Actor()
{
    this.pos = new Point();
    this.direction = new Vector(1, 1);
    this.speed = 1.0;

    this.img = 0;

    this.draw = function (ctx)
    {
        ctx.drawImage(this.img, this.pos.x, this.pos.y);
    }

    this.update = 0
}


function Ball()
{
    this.pos = new Point();
    this.direction = new Vector(0.5, 0.5);

    this.img = new Image();
    this.owner = 0;


    this.draw = function (ctx)
    {
        ctx.drawImage(this.img, this.pos.x, this.pos.y); 
    }

    this.update = function(elapsedTime)
    {
        if (this.owner)
        {
            this.pos.x = this.owner.pos.x;
            this.pos.y = this.owner.pos.y;
        }
        else
        {
            var r = new Rect(this.pos.y,
                             this.pos.x,
                             this.pos.y+this.img.height,
                             this.pos.x+this.img.width);

            if (!gBounds.containsRect(r))
            {
                if ((r.top < gBounds.top) || (r.bottom > gBounds.bottom))
                {
                    this.direction.y *= -1;
                }
                if ((r.left < gBounds.left) || (r.right > gBounds.right))
                {
                    this.direction.x *= -1;
                }
            }

            this.pos.x += this.direction.x * elapsedTime;
            this.pos.y += this.direction.y * elapsedTime;
        }

    }
}

function PetInit(p)
{
    p.direction.x = 0.1;
    p.direction.y = 0.1;
}


function PetUpdate(elapsedTime)
{
    this.direction.x = gBall.pos.x - this.pos.x;
    this.direction.y = gBall.pos.y - this.pos.y;

    this.pos.x += this.direction.x * this.speed * (elapsedTime/1000);
    this.pos.y += this.direction.y * this.speed * (elapsedTime/1000);
}


// App Data
var gCanvas;
var mouseX = 0;
var mouseY = 0;

var gBallImage = 0;
var gBubImage = 0;

// Game Data
var gLastTick = 0;
var gBounds = 0;
var gPlayer = new Actor();
var gPet = new Actor();
var gBall = new Ball();

var gMouseTracker = new MouseTracker(10, 50); // 10 samples every half second

function onClick(e)
{

}

function onMouseDown(e)
{
    gBall.owner = gPlayer;
}

function onMouseUp(e)
{
    gBall.owner = 0;
}

function onMouseMove(e)
{
    var rect = gCanvas.getBoundingClientRect();
    mouseX = e.pageX - rect.left;
    mouseY = e.pageY - rect.top;
}

function gameUpdate(elapsedTime)
{
    var start = 
    gPlayer.pos.x = mouseX - gBallImage.width/2;
    gPlayer.pos.y = mouseY - gBallImage.height/2;

    gPet.update(elapsedTime);
    gBall.update(elapsedTime);
    gMouseTracker.update(elapsedTime);
}


function drawUpdate()
{
    if (gCanvas && gCanvas.getContext)
    {
        var ctx = gCanvas.getContext('2d');
        if (ctx)
        {
            ctx.clearRect(0,0,gCanvas.width,gCanvas.height);

            gMouseTracker.draw(ctx);

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
    var currentTick = (new Date()).getTime();

    var elapsedTime = currentTick - gLastTick;

    gameUpdate(elapsedTime);
    drawUpdate();

    gLastTick = currentTick;
}

function startGame()
{
    gCanvas = document.getElementById('gameScreen');

    gCanvas.onmousemove=onMouseMove;
    gCanvas.onclick=onClick;
    gCanvas.onmousedown=onMouseDown;
    gCanvas.onmouseup=onMouseUp;

    gBubImage = new Image();
    gBubImage.src = "lilbub.png";

    gBallImage = new Image();
    gBallImage.src = "ball.png";

    gPet = new Actor();
    gPet.img = gBubImage;
    gPet.update = PetUpdate;

    gBall = new Ball();
    gBall.img = gBallImage;
    gBall.pos.x = 150;
    gBall.pos.y = 150;

    gPlayer = new Actor();

    var borderThickness = 5;

    gBounds = new Rect();
    gBounds.top = 5;
    gBounds.left = 5;
    gBounds.right = gCanvas.width - 5;
    gBounds.bottom = gCanvas.height - 5;

    // init lastTick, should be close
    gLastTick = (new Date()).getTime();

    setInterval(update, 1000/60); // 60 fps = 16.6ms   
}

