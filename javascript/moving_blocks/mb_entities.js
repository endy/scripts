
function Point(x, y)
{
    this.x = x;
    this.y = y;
}

var EntityType =
{
    Unknown:0,
    Ant:1,
    Chicken:2,
};

function Ant(x, y)
{
    this.type = EntityType.Ant;
    this.pos = new Point(x,y);
    this.dir = new Point(4,4);

    this.draw = function(canvasCtx)
    {
        canvasCtx.fillStyle = "black";
        canvasCtx.fillRect(this.pos.x, this.pos.y, 10, 10);
    }

    this.update = function()
    {
        this.pos.x += this.dir.x;
        this.pos.y += this.dir.y;

        if (this.pos.x < 0 || 800 < this.pos.x)
        {
            this.dir.x *= -1;
            this.pos.x = clamp(this.pos.x, 0, 800);
        }
        if (this.pos.y < 0 || 600 < this.pos.y)
        {
            this.dir.y *= -1;
            this.pos.y = clamp(this.pos.y, 0, 600);
        }
    }
}

function Chicken(homePoint)
{
    this.type = EntityType.Chicken;
    this.pos = new Point(homePoint.x, homePoint.y);
    this.homePoint = new Point(homePoint.x, homePoint.y);

    this.dir = new Point(1.3, 1.7);

    this.draw = function(canvasCtx)
    {
        canvasCtx.fillStyle = "white";
        canvasCtx.fillRect(this.pos.x, this.pos.y, 20, 20);
    }

    this.update = function()
    {
        this.pos.x += this.dir.x;
        this.pos.y += this.dir.y;

        if (this.pos.x < this.homePoint.x-40 ||  this.homePoint.x+40 < this.pos.x)
        {
            this.dir.x = (Math.random() - 0.5) * 4;
            this.pos.x = clamp(this.pos.x, this.homePoint.x-40,  this.homePoint.x+40);
        }
        if (this.pos.y <  this.homePoint.y-40 || this.homePoint.y+40 < this.pos.y)
        {
            this.dir.y *=  (Math.random() - 0.5) * 4;
            this.pos.y = clamp(this.pos.y, this.homePoint.y-40, this.homePoint.y+40);
        }        
    }
}

function updateBlock()
{
    var selectedBlock = null; 
      
    //for (i = 0; i < gEntities.length; i++)
    { 
      //  var b = gEntities[i];
        if (this.selected == true)
        {
            selectedBlock = this;
            //break;  // look no further, can only select one block at a time and we already have this one.
        }     
        else if (gMouseState.leftButtonPressed == true)
        {
            b = this;
             // implement update check
            if (b.pos.x <= gMouseState.pos.x &&
                gMouseState.pos.x < b.pos.x + b.width &&
                b.pos.y <= gMouseState.pos.y &&
                gMouseState.pos.y < b.pos.y + b.height)
            {
                    selectedBlock = b;
            }
        }
    }  

    if (selectedBlock != null)
    {
        if (gMouseState.leftButtonPressed == true)
        {
            selectedBlock.pos = new Point(gMouseState.pos.x - (selectedBlock.width / 2),
                                      gMouseState.pos.y - (selectedBlock.height / 2));
            selectedBlock.selected = true;
        }
        else
        {
            selectedBlock.selected = false;

            // Snap block to grid based on block center
            // todo: add a highlight where the block will drop, instead of blind snapping
            selectedBlock.pos.x -= ((selectedBlock.pos.x +20) % 40) - 20;
            selectedBlock.pos.y -= ((selectedBlock.pos.y +20) % 40) - 20;
        }
    }
}


function Block(x, y)
{
    this.pos    = new Point(x,y); 
    this.width  = 40; 
    this.height = 40;

    this.draw = function(canvasCtx)
    {
        canvasCtx.fillStyle = "blue";
        canvasCtx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        canvasCtx.fillStyle = "white";
        canvasCtx.font = "30px Arial";
        canvasCtx.fillText("1", this.pos.x+10, this.pos.y+30);  
    }

    this.update = updateBlock; 
}


