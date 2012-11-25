

import pyglet
from pyglet.gl import *

import ctypes as c

def shaderSource(text):
        buff = c.create_string_buffer(text)
        c_text = c.cast(c.pointer(c.pointer(buff)), c.POINTER(c.POINTER(GLchar)))
        return c_text

vertShaderSrc = '''
attribute vec2 in_Position;
varying vec2 v_FragPos;
void main(void)
{
    vec4 position = vec4(in_Position, 1.0, 1.0);
    gl_Position = position;
    v_FragPos = (position.xy + vec2(0.75)) / vec2(2.0);
}'''

fragShaderSrc = '''
varying vec2 v_FragPos;
void main(void)
{
    gl_FragColor = vec4(v_FragPos.x, 0.0, v_FragPos.y, 1.0);
}'''

window = pyglet.window.Window()

#
# OpenGL Program
#
vsId = glCreateShader(GL_VERTEX_SHADER)
fsId = glCreateShader(GL_FRAGMENT_SHADER)
progId = glCreateProgram()

glShaderSource(vsId, 1, shaderSource(vertShaderSrc), None)
glCompileShader(vsId)

c_compileStatus = c_int()
glGetShaderiv(vsId, GL_COMPILE_STATUS, byref(c_compileStatus))

glShaderSource(fsId, 1, shaderSource(fragShaderSrc), None)
glCompileShader(fsId)

glGetShaderiv(fsId, GL_COMPILE_STATUS, byref(c_compileStatus))

glAttachShader(progId, vsId)
glAttachShader(progId, fsId)
glLinkProgram(progId)

length = c_int()

glGetProgramiv(progId, GL_INFO_LOG_LENGTH, byref(length))

log = c.create_string_buffer(length.value)
glGetProgramInfoLog(progId, length, byref(length), log)
print  log.value.rstrip("\n\r")

#
# OpenGL Vertex Buffer
#

vbData = [-0.75, -0.75, 0.75, -0.75, -0.75, 0.75, 0.75, 0.75 ]
c_float_type = c_float*len(vbData)
c_vbData = c_float_type(*vbData)

vbId = c_uint()
glGenBuffers(1, byref(vbId))
glBindBuffer(GL_ARRAY_BUFFER, vbId.value)
glBufferData(GL_ARRAY_BUFFER, sizeof(c_vbData), c_vbData, GL_STATIC_DRAW)

posLoc = glGetAttribLocation(progId, "in_Position")
glBindAttribLocation(progId, posLoc, "in_Position")
glVertexAttribPointer(posLoc, 2, GL_FLOAT, 0, 4*2, 0)

glEnableVertexAttribArray(posLoc)

@window.event
def on_draw():
        glClearColor(1.0, 1.0, 0.0, 1.0)
        glClear(GL_COLOR_BUFFER_BIT)

        glUseProgram(progId)

        glDrawArrays(GL_TRIANGLE_STRIP, 0, 4)

pyglet.app.run()



