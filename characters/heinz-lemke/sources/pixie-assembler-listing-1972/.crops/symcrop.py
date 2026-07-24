from PIL import Image, ImageOps
im = ImageOps.autocontrast(Image.open('pages/page-110.png').convert('L'))
w, h = im.size
y0, y1 = 150, h-30
bands = {'A': (150, 990), 'B': (1100, 1950)}
step = (y1-y0)//3
for tag,(bx0,bx1) in bands.items():
    for i in range(3):
        a = max(y0, y0+i*step-40); b = min(y1, y0+(i+1)*step+40)
        c = im.crop((bx0,a,bx1,b))
        c = c.resize((c.width*2, c.height*2), Image.LANCZOS)
        c.save(f'.crops/page-110-{tag}{i}.png')
print('ok')
