import sys
from PIL import Image, ImageOps
page = sys.argv[1]
im = Image.open(f'pages/page-{page}.png').convert('L')
im = ImageOps.autocontrast(im)
w, h = im.size
# text region: trim margins
x0, x1 = 80, min(w, 2600)
y0, y1 = 150, h - 30
n = 3
overlap = 60
step = (y1 - y0) // n
for i in range(n):
    a = max(y0, y0 + i*step - overlap)
    b = min(y1, y0 + (i+1)*step + overlap)
    crop = im.crop((x0, a, x1, b))
    crop = crop.resize((crop.width*2, crop.height*2), Image.LANCZOS)
    crop.save(f'.crops/page-{page}-s{i}.png')
    print(f'page-{page}-s{i}.png', crop.size)
