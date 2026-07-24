import sys, numpy as np
from PIL import Image, ImageOps
for page in sys.argv[1:]:
    im = ImageOps.autocontrast(Image.open(f'pages/page-{page}.png').convert('L'))
    a = np.asarray(im); h, w = a.shape
    dark = a[200:h-200, :] < 128
    prof = dark.sum(axis=0)
    thr = max(15, int(prof[100:].max()*0.08))
    on = prof > thr
    # bridge gaps <=12
    runs = []
    x = 100
    while x < w:
        if on[x]:
            s = x
            gap = 0; e = x
            while x < w and gap <= 12:
                if on[x]: e = x; gap = 0
                else: gap += 1
                x += 1
            runs.append((s, e))
        else:
            x += 1
    x0 = None
    for s, e in runs:
        if e - s >= 55:
            x0 = s; break
    print(page, 'x0=', x0, 'runs=', runs[:6])
