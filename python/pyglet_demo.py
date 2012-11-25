

import pyglet
import pyglet.gl

window = pyglet.window.Window()
image = pyglet.resource.image('kitten.png')

@window.event
def on_draw():
        pyglet.gl.glClearColor(1.0, 1.0, 0.0, 1.0)
        pyglet.gl.glClear(pyglet.gl.GL_COLOR_BUFFER_BIT)
        image.blit(0,0)

pyglet.app.run()

