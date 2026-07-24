import sys, numpy as np
from PIL import Image, ImageOps
page = sys.argv[1]
im = Image.open(f'pages/page-{page}.png').convert('L')
im = ImageOps.autocontrast(im)
a = np.asarray(im)
# ink = dark pixels within text x-band
band = a[:, 120:2500] < 128
prof = band.sum(axis=1)
rows = []
in_row = False
for y, v in enumerate(prof):
    if v > 8 and not in_row:
        start = y; in_row = True
    elif v <= 8 and in_row:
        in_row = False
        if y - start > 8:
            rows.append((start + y)//2)
print(len(rows))
print(','.join(map(str, rows)))
