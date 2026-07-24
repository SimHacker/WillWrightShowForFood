import sys, numpy as np
from PIL import Image, ImageOps

def text_x0(im):
    a = np.asarray(im)
    h, w = a.shape
    dark = a[150:h-150, :] < 128
    prof = dark.sum(axis=0)
    # smooth; ignore narrow isolated blobs (sprocket dots) by requiring a run
    thr = max(10, int(prof.max()*0.04))
    run = 0
    for x in range(w):
        if prof[x] > thr:
            run += 1
            if run > 40:
                return x - run
        else:
            run = 0
    return 0

page = sys.argv[1]
im = Image.open(f'pages/page-{page}.png').convert('L')
im = ImageOps.autocontrast(im)
w, h = im.size
x0 = text_x0(im)
print(page, 'x0=', x0)
y0, y1 = 130, h - 30
# strips: full text width
sx0, sx1 = max(0, x0-20), min(w, x0+2530)
step = (y1-y0)//3
for i in range(3):
    a_ = max(y0, y0+i*step-60); b_ = min(y1, y0+(i+1)*step+60)
    c = im.crop((sx0, a_, sx1, b_)); c = c.resize((c.width*2, c.height*2), Image.LANCZOS)
    c.save(f'.crops/page-{page}-s{i}.png')
# left band: SEQ..LABEL
lx0, lx1 = max(0, x0-20), min(w, x0+930)
step = (y1-y0)//2
for i in range(2):
    a_ = max(y0, y0+i*step-40); b_ = min(y1, y0+(i+1)*step+40)
    c = im.crop((lx0, a_, lx1, b_)); c = c.resize((c.width*2, c.height*2), Image.LANCZOS)
    c.save(f'.crops/page-{page}-L{i}.png')
# mid band: LABEL/INSTR + comment start
mx0, mx1 = max(0, x0+450), min(w, x0+1170)
step = (y1-y0)//3
for i in range(3):
    a_ = max(y0, y0+i*step-40); b_ = min(y1, y0+(i+1)*step+40)
    c = im.crop((mx0, a_, mx1, b_)); c = c.resize((c.width*2, c.height*2), Image.LANCZOS)
    c.save(f'.crops/page-{page}-M{i}.png')
