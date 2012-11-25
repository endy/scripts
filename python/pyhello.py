# comment

n = 1
src = 0

def func(a, b, c="defaultparam"):
    print "Hello World\n"
    print "Hello next line\n"
    print "A="+ a + " B=" + b + " C=" + c

while n > 0:
    f = open('pyhello.py', 'r')
    print f
    src = f.read()
    print src
    func("1", "2")
    n = n - 1

print "end"
f = open('outfile.txt', 'w')
f.write(src)

