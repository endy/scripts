
import pyglet

window = pyglet.window.Window()
image = pyglet.resource.image('kitten.png')

@window.event
def on_draw():
        image.blit(0,0)

pyglet.app.run()

