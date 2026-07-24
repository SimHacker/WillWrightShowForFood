import sys
from PIL import Image, ImageOps
page, seqx = sys.argv[1], int(sys.argv[2])
im = ImageOps.autocontrast(Image.open(f'pages/page-{page}.png').convert('L'))
w, h = im.size
y0, y1 = 130, h - 30
def band(tag, bx0, bx1, n, ov):
    step = (y1-y0)//n
    for i in range(n):
        a = max(y0, y0+i*step-ov); b = min(y1, y0+(i+1)*step+ov)
        c = im.crop((max(0,bx0), a, min(w,bx1), b))
        c = c.resize((c.width*2, c.height*2), Image.LANCZOS)
        c.save(f'.crops/page-{page}-{tag}{i}.png')
band('s', seqx-120, seqx+2450, 3, 60)
band('L', seqx-40, seqx+880, 2, 40)
band('M', seqx+420, seqx+1150, 3, 40)
print('done', page)
