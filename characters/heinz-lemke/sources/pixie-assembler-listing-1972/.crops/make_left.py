import sys
from PIL import Image, ImageOps
page = sys.argv[1]
im = Image.open(f'pages/page-{page}.png').convert('L')
im = ImageOps.autocontrast(im)
w, h = im.size
x0, x1 = 80, 1000   # SEQ, ADDR, OCTAL, LABEL start
y0, y1 = 150, h - 30
n = 2
overlap = 40
step = (y1 - y0) // n
for i in range(n):
    a = max(y0, y0 + i*step - overlap)
    b = min(y1, y0 + (i+1)*step + overlap)
    crop = im.crop((x0, a, x1, b))
    crop = crop.resize((crop.width*2, crop.height*2), Image.LANCZOS)
    crop.save(f'.crops/page-{page}-L{i}.png')
    print(f'page-{page}-L{i}.png', crop.size)
