import sys
from PIL import Image, ImageOps
# usage: zoom_lines.py page out.png x0 x1 y1,y2,y3...   (y = original px centers)
page, out, x0, x1 = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
ys = [int(v) for v in sys.argv[5].split(',')]
im = Image.open(f'pages/page-{page}.png').convert('L')
im = ImageOps.autocontrast(im)
scale = 4
half = 26
strips = []
for y in ys:
    c = im.crop((x0, y-half, x1, y+half))
    c = c.resize((c.width*scale, c.height*scale), Image.LANCZOS)
    strips.append(c)
gap = 24
W = max(s.width for s in strips)
H = sum(s.height for s in strips) + gap*(len(strips)-1)
canvas = Image.new('L', (W, H), 255)
yy = 0
for s in strips:
    canvas.paste(s, (0, yy)); yy += s.height + gap
canvas.save(f'.crops/{out}')
print(out, canvas.size)
