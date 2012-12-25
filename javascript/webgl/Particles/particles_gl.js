///////////////////////////////////////////////////////////////////////////////////////////////////
///
///     Copyright 2012, Brandon Light
///     All rights reserved.
///
///////////////////////////////////////////////////////////////////////////////////////////////////

/// TODO: Determine proper javascript documentation form...


///////////////////////////////////////////////////////////////////////////////////////////////////
/// Data Objects

function Particles()
{
    this.count    = 0;
    this.pos      = []
    this.texcoord = []
    this.velocity = []
}

////////////////////////////////////////////////////////////////////////////////
/// Globals

var gGL;
var gShaderProgram;
var gPointsPositionBuffer;
var gPointsTextureBuffer;

var gParticles = new Particles();

var gParticleGridWidth  = 32;
var gParticleGridHeight = 32;


var simpleVert = '                                                      \
                                                                        \
attribute vec3 in_Position;                                             \
attribute vec2 in_Texcoord;                                             \
varying   vec2 v_Texcoord; \
                                                                        \
void main(void)                                                         \
{        \
    v_Texcoord = in_Texcoord; \
    gl_PointSize = 3.0;    \
    gl_Position = vec4(in_Position, 1.0);    \
}                                                                       \
    \
';


var simpleFrag = '              \
                                \
precision mediump float;        \
varying vec2 v_Texcoord;        \
                                \
void main(void)                                 \
{                                               \
    gl_FragColor = vec4(v_Texcoord, 0.7, 1.0);    \
}                                               \
    \
';
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////
/// initGL
///////////////////////////////////////////////////////////////////////////////////////////////////
function initGL(canvas)
{
    try 
    {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) 
    {
    }
        
    if (!gl)
    {
        alert("Could not initialise WebGL");
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/// getShaderByType
///////////////////////////////////////////////////////////////////////////////////////////////////
function getShaderByType(gl, type, src) 
{
    var shader;
    if (type == "frag") 
    {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } 
    else if (type == "vert") 
    {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else
    {
        return null;
    }

    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/// initShaders
///////////////////////////////////////////////////////////////////////////////////////////////////
function initShaders()
{
    var fragmentShader = getShaderByType(gl, "frag", simpleFrag);
    var vertexShader = getShaderByType(gl, "vert", simpleVert);

    gShaderProgram = gl.createProgram();
    gl.attachShader(gShaderProgram, vertexShader);
    gl.attachShader(gShaderProgram, fragmentShader);
    gl.linkProgram(gShaderProgram);

    if (!gl.getProgramParameter(gShaderProgram, gl.LINK_STATUS))
    {
        alert("Could not initialise shaders");
    }

    gl.useProgram(gShaderProgram);

    gShaderProgram.positionAttribute = gl.getAttribLocation(gShaderProgram, "in_Position");
    gl.enableVertexAttribArray(gShaderProgram.vertexPositionAttribute);

    gShaderProgram.textureAttribute = gl.getAttribLocation(gShaderProgram, "in_Texcoord");
    gl.enableVertexAttribArray(gShaderProgram.textureAttribute);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/// initParticles2DArray
///////////////////////////////////////////////////////////////////////////////////////////////////
function initParticles2DArray(width, height)
{
    for (var h = 0; h < height; ++h) 
    {
        for (var w = 0; w < width; ++w) 
        {
            var vec3index = (h * width * 3) + (w * 3);
            var vec2index = (h * width * 2) + (w * 2);

            var posx = -1.0 + ((2.0 / width) * w);
            var posy = -1.0 + ((2.0 / height) * h);

            gParticles.pos[vec3index]   = posx;
            gParticles.pos[vec3index+1] = posy;
            gParticles.pos[vec3index+2] = 0.5;

            gParticles.texcoord[vec2index] = w / width;
            gParticles.texcoord[vec2index+1] = 1.0 - h / height;

            var magnitude = Math.sqrt(posx*posx + posy*posy);

            gParticles.velocity[vec3index]   = posx / magnitude;
            gParticles.velocity[vec3index+1] = posy / magnitude;
            gParticles.velocity[vec3index+2] = 0;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/// initParticles
///////////////////////////////////////////////////////////////////////////////////////////////////
function initParticles(count)
{
    gParticles.count    = gParticleGridWidth * gParticleGridHeight;
    gParticles.pos      = new Array(gParticles.count*3);
    gParticles.texcoord = new Array(gParticles.count*2);
    gParticles.velocity = new Array(gParticles.count*3);

    initParticles2DArray(gParticleGridWidth, gParticleGridHeight)
}


///////////////////////////////////////////////////////////////////////////////////////////////////
/// updateParticles
///////////////////////////////////////////////////////////////////////////////////////////////////
function updateParticles(timestep)
{
    var bounds = 1.0;
    
    timestep *= 1;
    
    var gravityDecel = 4 * timestep;
    var xFriction = 3.0 * timestep;

    for (var i = 0; i < gParticles.count; ++i)
    {
        gParticles.velocity[(i*3)+1] -= gravityDecel;

        // update position
        gParticles.pos[(i*3)] = Math.min(bounds, Math.max(-bounds, gParticles.pos[(i*3)] + (gParticles.velocity[i*3] * timestep)));

        if ((gParticles.pos[i*3] <= -bounds) || (gParticles.pos[i*3] >= bounds))
        {
            gParticles.velocity[i*3] *= -0.25;
        }

        gParticles.pos[(i*3)+1] = Math.min(bounds, Math.max(-bounds, gParticles.pos[(i*3)+1] + (gParticles.velocity[(i*3)+1] * timestep)));

        if ((gParticles.pos[(i*3)+1] <= -bounds) || (gParticles.pos[(i*3)+1] >= bounds))
        {
            gParticles.velocity[(i*3)+1] *= -0.8;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/// initBuffers
///////////////////////////////////////////////////////////////////////////////////////////////////
function initBuffers()
{
    initParticles();

    gPointsPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gPointsPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gParticles.pos), gl.STATIC_DRAW);
    gPointsPositionBuffer.itemSize = 3;
    gPointsPositionBuffer.numItems = gParticles.count;

    gPointsTextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gPointsTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gParticles.texcoord), gl.STATIC_DRAW);
    gPointsTextureBuffer.itemSize = 2;
    gPointsTextureBuffer.numItems = gParticles.count;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
/// drawScene
///////////////////////////////////////////////////////////////////////////////////////////////////
function drawScene()
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, gPointsPositionBuffer);
    gl.vertexAttribPointer(gShaderProgram.positionAttribute, gPointsPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, gPointsTextureBuffer);
    gl.vertexAttribPointer(gShaderProgram.textureAttribute, gPointsTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, gPointsPositionBuffer.numItems);
}

function restartParticles()
{
    initParticles2DArray(32, 32);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/// gameLoop
///////////////////////////////////////////////////////////////////////////////////////////////////
function gameLoop()
{
    updateParticles(0.04);

    gl.bindBuffer(gl.ARRAY_BUFFER, gPointsPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gParticles.pos), gl.STATIC_DRAW);

    drawScene();
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/// webGLStart
///////////////////////////////////////////////////////////////////////////////////////////////////
function webGLStart()
{
    var canvas = document.getElementById("ParticlesCanvas");

    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    setInterval(gameLoop, 100);
}


