// UTILITIES
function clamp(value, min, max)
{
    return (value < min) ? min : 
                          (max < value) ? max : 
                                          value;
}

///////////////////////////////////////////
// GLOBALS
var gUIEntities       = [];
var gDrawableEntities = [];
var gEntities         = [];

var gKeyState = { keys:{} };

var gMouseState = { pos:new Point(0,0),
                    prevPos:new Point(0,0),
                    valid:false,
                    leftButton:0,
                    leftButtonPressed:false,
                    rightButton:0,
                    rightButtonPressed:false};

function loadResources()
{
    // blockImage = new Image();
    // blockImage.src = "some_block.png";
}


function createEntities()
{
    // create all game entities
    // for each entity
    //    create the object
    //    add it to a UI list if interactive
    //    add it to a draw list if drawable
    //    add it to an update list if has internal update needs (should be all entities)

    var blocks = [new Block(80, 80), new Block(480, 480), new Block(360, 200) ];
   
    for (i = 0; i < blocks.length; i++)
    {
        gEntities.push(blocks[i]);
        gDrawableEntities.push(blocks[i]);
    }

    var ants = [new Ant(30,30), 
                new Ant(400,200),
                new Ant(700, 10),
                new Ant(300, 580),
                new Ant(100, 300)];

    for (i = 0; i < ants.length; i++)
    {
        gEntities.push(ants[i]);
        gDrawableEntities.push(ants[i]);
    }

    var chickens = [new Chicken(new Point(100, 100)),
                    new Chicken(new Point(700, 300)),
                    new Chicken(new Point(250, 500))];

    for (i = 0; i < chickens.length; i++)
    {
        gEntities.push(chickens[i]);
        gDrawableEntities.push(chickens[i]);
    }
}

function testEntityIntersect(a, b)
{
    var intersect = false;

    ///@todo cache intersect rect in entity

   // if (


    return intersect;
}

function updateEntities()
{
    // Process Input
    for (k in gKeyState.keys)
    {
        if (gKeyState.keys[k] == 1)
        {
            console.log(k);
        }
    }

    // Determine world state
    for (i = 0; i < gEntities.length; i++)
    {
        for (j = 0; j < gEntities.length; j++)
        {
            var entityA = gEntities[i];
            var entityB = gEntities[j];
            if (((entityA.type == Ant) && (entityB.type == Chicken)) ||
                ((entityA.type == Chicken) && (entityB.type == Ant)))
            {
                // Test collision
                if (testEntityIntersect(entityA, entityB) == true)
                {
                    // Kill Ant
                    var ant = (entityA.type == EntityType.Ant) ? entityA : entityB;

                    gEntities.remove(ant);
                    gDrawableEntities.remove(ant);
                }
            }

        }
    }


    // Update entities
    for (i = 0; i < gEntities.length; i++)
    {
        gEntities[i].update();
    }
}

function drawUI(ctx)
{

}
function drawGrid(ctx)
{
    var screenWidth = document.getElementById('screen').width;
    var screenHeight = document.getElementById('screen').height;
    var verticalLines = screenWidth / 40;
    var horizontalLines = screenHeight / 40;

    for (var i = 1; i < verticalLines; i++)
    {
        ctx.beginPath();
        ctx.moveTo(i*40, 0);
        ctx.lineTo(i*40, screenHeight);
        ctx.stroke();
    }
    for (var i = 1; i < horizontalLines; i++)
    {
        ctx.beginPath();
        ctx.moveTo(0,           i*40);
        ctx.lineTo(screenWidth, i*40);
        ctx.stroke();
    }
}

function drawWorld()
{
    canvas = document.getElementById('screen');
    var ctx = canvas.getContext('2d');

    var b = Block(10, 10);

    if (ctx)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "grey";
        ctx.fillRect(0, 0, canvas.width, canvas.height); 

        drawGrid(ctx);
    }

    for (i = 0; i < gDrawableEntities.length; i++)
    {
            var e = gDrawableEntities[i];
            e.draw(ctx);

        // refactor this out of drawWorld
        drawUI(ctx);
    }

    var worldLogString =  "MousePos: (" + gMouseState.pos.x + ", " + gMouseState.prevPos.y + ")";


    var worldLog = document.getElementById("worldLog");
    worldLog.innerHTML = worldLogString;
}

function screenClicked()
{
    var canvas = document.getElementById('screen');
    var rect = canvas.getBoundingClientRect();

    var mouseLoc = { x:(event.clientX-rect.left),
                     y:(event.clientY-rect.top)   };

}

function updateMouse()
{
    gMouseState.prevPos = new Point(gMouseState.pos.x, gMouseState.pos.y);
}

function screenMouseMove()
{
    var canvas = document.getElementById('screen');
    var rect = canvas.getBoundingClientRect(); 
    gMouseState.pos = new Point(event.clientX-rect.left, event.clientY-rect.top);
}

var lastDownTarget = 0;
function mouseDown(event)
{
    lastDownTarget = event.target;
    gMouseState.leftButtonPressed = true;  
}

function mouseUp()
{
    gMouseState.leftButtonPressed = false;   
}

function mouseLeave()
{ 
    gMouseState.valid = 0;
}
function mouseEnter()
{
    
    gMouseState.valid = 1;
}
var message = "";
function keyDown(event)
{
    if (65 <= event.keyCode && event.keyCode < 91)
    {
        var c = String.fromCharCode(event.keyCode);
        message += c;
        gKeyState.keys[c] = 1;
    }
    else if (event.keyCode == 13)
    {
        document.getElementById("uiLog").innerHTML = message;
        message = "";
    }
}

function keyUp(event)
{
    if (65 <= event.keyCode && event.keyCode < 91)
    {
        var c = String.fromCharCode(event.keyCode);
        gKeyState.keys[c] = 0;
    }
}

function updateWorld()
{
    updateMouse();

    updateEntities();

    drawWorld();
}

function initApp()
{
    loadResources();
    createEntities();

    var canvas = document.getElementById('screen');
    document.addEventListener('mousedown', function(event) {mouseDown(event); }, false);
    document.addEventListener('keydown', function(event) { if (lastDownTarget == canvas){ keyDown(event); }} , false); 
    document.addEventListener('keyup', function(event) { if (lastDownTarget == canvas){ keyUp(event); }} , false);
  
    setInterval(updateWorld, 1000/60);
}

