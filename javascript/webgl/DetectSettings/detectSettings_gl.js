

var test = 0;

////////////////////////////////////////////////////////////////////////////////
var simpleVert = '                                                      \
                                                                        \
attribute vec3 aVertexPosition;                                         \
                                                                        \
uniform mat4 uMVMatrix;                                                 \
uniform mat4 uPMatrix;                                                  \
                                                                        \
void main(void)                                                         \
{                                                                       \
    gl_Position = vec4(aVertexPosition, 1.0);    \
}                                                                       \
    \
';


var simpleFrag = '              \
                                \
precision mediump float;        \
                                \
void main(void)                                 \
{                                               \
    gl_FragColor = vec4(0.4, 0.0, 0.7, 1.0);    \
}                                               \
    \
';
///////////////////////////////////////////////////////////////////////////////

var gGLQueryStrings;

var gl;

function initQueryStrings(gl)
{
    gGLQueryStrings = [
        gl.VENDOR, "VENDOR",
        gl.RENDERER, "RENDERER",
        gl.VERSION, "VERSION",


        gl.MAX_TEXTURE_SIZE, "MAX TEXTURE SIZE",
    ];

}

function initGL(canvas)
{
    try 
    {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        
        initQueryStrings(gl);
        
        var infoString = "WebGL Parameters:<br />";
        for (var i = 0; i < gGLQueryStrings.length; i+=2)
        {
            infoString += gGLQueryStrings[i+1] + ": " + gl.getParameter(gGLQueryStrings[i]) + "<br />";
        }

        infoString += "WebGL Extensions Supported:<br />" + gl.getSupportedExtensions();

        var settingsSpan = document.getElementById("Settings");
        settingsSpan.innerHTML = infoString;

        //
    } catch (e) 
    {
    }
    
    if (!gl)
    {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


    function getShaderByType(gl, type, src) {

        var shader;
        if (type == "frag") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type == "vert") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
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


    var shaderProgram;

    function initShaders() {
        var fragmentShader = getShaderByType(gl, "frag", simpleFrag);
        var vertexShader = getShaderByType(gl, "vert", simpleVert);

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    }





    var triangleVertexPositionBuffer;
    var squareVertexPositionBuffer;

    function initBuffers() {
        triangleVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        var vertices = [
             0.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        triangleVertexPositionBuffer.itemSize = 3;
        triangleVertexPositionBuffer.numItems = 3;

        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        vertices = [
             1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0, -1.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = 4;
    }


function drawScene() 
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

   // gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}


function webGLStart() 
{
    // detect Chrome
    //var is_chrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    //alert("Chrome: " + is_chrome);

    var canvas = document.getElementById("Points");

    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}

