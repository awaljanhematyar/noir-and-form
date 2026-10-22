"""Compose actual browser captures into a 16:9 monitor/phone portfolio scene; no invented UI."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'portfolio'
SCALE = 2
W, H = 1600, 900

def rect(draw, bounds, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(tuple(round(v*SCALE) for v in bounds), radius=radius*SCALE, fill=fill, outline=outline, width=width*SCALE)

def fit_screen(path, width, height):
    image = Image.open(path).convert('RGB')
    ratio = width / height
    if abs(image.width / image.height - ratio) > .01:
        raise ValueError(f'Screen aspect ratio mismatch for {path.name}; recapture instead of distorting.')
    return image.resize((width*SCALE, height*SCALE), Image.Resampling.LANCZOS)

# BACKDROP AND NATURAL CONTACT SHADOWS
canvas = Image.new('RGB', (W*SCALE, H*SCALE), '#e9e5dd')
gradient = ImageDraw.Draw(canvas)
for y in range(H*SCALE):
    shade = int(243 - 16 * y/(H*SCALE))
    gradient.line((0, y, W*SCALE, y), fill=(shade, shade-3, shade-9))
shadow = Image.new('RGBA', canvas.size)
d = ImageDraw.Draw(shadow)
d.ellipse((170*SCALE, 745*SCALE, 1240*SCALE, 825*SCALE), fill=(45, 39, 28, 65))
d.ellipse((1130*SCALE, 760*SCALE, 1460*SCALE, 810*SCALE), fill=(45, 39, 28, 90))
canvas = Image.alpha_composite(canvas.convert('RGBA'), shadow.filter(ImageFilter.GaussianBlur(22*SCALE)))
draw = ImageDraw.Draw(canvas)

# ALUMINUM DESKTOP MONITOR — actual screenshot remains rectangular and proportionate.
draw.polygon([(625*SCALE,730*SCALE),(775*SCALE,730*SCALE),(800*SCALE,800*SCALE),(600*SCALE,800*SCALE)], fill='#b9b8b4')
rect(draw,(550,798,850,813),6,'#c9c8c3')
desktop = fit_screen(OUT/'screenshots'/'desktop-home-viewport.png',960,600)
rect(draw,(200,113,1190,755),15,'#555753')
rect(draw,(203,116,1187,750),13,'#151716')
canvas.alpha_composite(desktop.convert('RGBA'),(215*SCALE,130*SCALE))
draw = ImageDraw.Draw(canvas)
rect(draw,(203,731,1187,755),0,'#c9cac5')
draw.ellipse((690*SCALE,738*SCALE,698*SCALE,746*SCALE),fill='#777b73')

# SMARTPHONE — portrait capture is masked only at the hardware's rounded corners.
phone_shadow = Image.new('RGBA',canvas.size)
pd = ImageDraw.Draw(phone_shadow)
rect(pd,(1139,223,1430,806),38,(0,0,0,70))
canvas = Image.alpha_composite(canvas,phone_shadow.filter(ImageFilter.GaussianBlur(13*SCALE)))
draw = ImageDraw.Draw(canvas)
rect(draw,(1128,202,1404,802),38,'#676960')
rect(draw,(1131,204,1401,800),36,'#171918')
mobile = fit_screen(OUT/'screenshots'/'mobile-home-viewport.png',260,round(260*844/390))
mask = Image.new('L',mobile.size)
ImageDraw.Draw(mask).rounded_rectangle((0,0,mobile.width,mobile.height),radius=28*SCALE,fill=255)
canvas.paste(mobile,(1136*SCALE,222*SCALE),mask)
draw = ImageDraw.Draw(canvas)
rect(draw,(1211,229,1321,244),7,'#171918')
rect(draw,(1231,775,1301,779),2,'#d9d8d1')
rect(draw,(1125,312,1129,360),2,'#55584f')
rect(draw,(1403,342,1406,391),2,'#55584f')

# EDITORIAL CAPTION — outside the screenshots, without altering their website content.
font_path = Path('C:/Windows/Fonts/georgia.ttf')
sans_path = Path('C:/Windows/Fonts/arial.ttf')
serif = ImageFont.truetype(str(font_path), 30*SCALE)
sans = ImageFont.truetype(str(sans_path), 10*SCALE)
draw.text((65*SCALE,48*SCALE),'NOIR & FORM',font=serif,fill='#171717')
draw.text((66*SCALE,91*SCALE),'FASHION E-COMMERCE / RESPONSIVE DESIGN',font=sans,fill='#51574b')
draw.text((66*SCALE,843*SCALE),'PROJECT 03  /  AWAL JAN HEMATYAR',font=sans,fill='#51574b')
draw.text((1192*SCALE,843*SCALE),'CONSIDERED, BY DESIGN.',font=sans,fill='#51574b')
OUT.mkdir(parents=True,exist_ok=True)
path = OUT/'noir-and-form-cover.png'
canvas.convert('RGB').save(path,optimize=True)
print(path)
print(f'{W*SCALE} × {H*SCALE}; {path.stat().st_size:,} bytes; actual screenshot pixels composited, no generated website elements.')
