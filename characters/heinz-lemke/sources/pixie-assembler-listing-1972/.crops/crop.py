import sys
from PIL import Image
n = sys.argv[1]
x0 = int(sys.argv[2]) if len(sys.argv)>2 else 0
x1 = int(sys.argv[3]) if len(sys.argv)>3 else 1600
im = Image.open(f'pages/page-{n}.png')
w,h = im.size
im.crop((x0,0,x1,h//2+100)).save(f'.crops/p{n}-top.png')
im.crop((x0,h//2-100,x1,h)).save(f'.crops/p{n}-bot.png')
