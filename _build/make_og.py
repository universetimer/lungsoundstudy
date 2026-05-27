"""청진음 학습기 OG 이미지/파비콘 생성"""
from PIL import Image, ImageDraw, ImageFont
import math, random, os

PROJECT = r"C:\Users\unive\OneDrive\111 Claude\청진음 분석 앱"
OUT = os.path.join(PROJECT, "og-image.png")
ICON192 = os.path.join(PROJECT, "favicon-192.png")
ICON_APPLE = os.path.join(PROJECT, "apple-touch-icon.png")
ICON32 = os.path.join(PROJECT, "favicon-32.png")
FONT_BOLD = r"C:\Windows\Fonts\malgunbd.ttf"
FONT_REG = r"C:\Windows\Fonts\malgun.ttf"

W, H = 1200, 630

# ---------- magma colormap ----------
def magma(t):
    stops = [(0,0,4),(28,16,68),(79,18,123),(129,37,129),
             (181,54,122),(229,80,100),(251,135,97),
             (254,194,135),(252,253,191)]
    t = max(0.0, min(1.0, t))
    x = t * (len(stops) - 1)
    i = int(x)
    if i >= len(stops) - 1: return stops[-1]
    f = x - i
    a, b = stops[i], stops[i+1]
    return (int(a[0]+(b[0]-a[0])*f), int(a[1]+(b[1]-a[1])*f), int(a[2]+(b[2]-a[2])*f))

# ---------- background gradient ----------
img = Image.new("RGB", (W, H))
px = img.load()
for y in range(H):
    for x in range(W):
        t = (x * 0.55 + y * 0.45) / (W * 0.55 + H * 0.45)
        if t < 0.5:
            u = t * 2
            r = int(0x07 + (0x0E - 0x07) * u)
            g = int(0x3F + (0x5A - 0x3F) * u)
            b = int(0x62 + (0x8A - 0x62) * u)
        else:
            u = (t - 0.5) * 2
            r = int(0x0E + (0x14 - 0x0E) * u)
            g = int(0x5A + (0xB8 - 0x5A) * u)
            b = int(0x8A + (0xA6 - 0x8A) * u)
        px[x, y] = (r, g, b)

draw = ImageDraw.Draw(img)

# ---------- left visualization box ----------
random.seed(7)
SG_X, SG_Y, SG_W, SG_H = 80, 130, 480, 280

# rounded background
draw.rounded_rectangle([SG_X-12, SG_Y-12, SG_X+SG_W+12, SG_Y+SG_H+12], radius=16, fill=(8, 22, 44))

# spectrogram (upper 2/3)
sg_h_main = int(SG_H * 0.62)
for y in range(sg_h_main):
    freq = 1 - y / sg_h_main
    for x in range(SG_W):
        t_x = x / SG_W
        b1 = max(0, 1 - abs((t_x - 0.20) * 25)) * (1 - freq) * 1.2
        b2 = max(0, 1 - abs((t_x - 0.42) * 30)) * (1 - freq * 0.7) * 1.0
        b3 = max(0, 1 - abs((t_x - 0.70) * 22)) * (1 - freq) * 1.0
        wheeze = math.exp(-((freq - 0.55) ** 2) * 80) * (0.6 + 0.3 * math.sin(t_x * 25)) * (0.3 + 0.5 * (math.sin(t_x * 4) + 1) / 2)
        noise = (random.random() ** 2) * (1 - freq * 0.6) * 0.22
        val = b1 + b2 + b3 + wheeze + noise
        val = max(0, min(1, val * 0.88))
        px[SG_X + x, SG_Y + y] = magma(val)

# waveform (lower 1/3)
wf_y_start = SG_Y + sg_h_main + 6
wf_h = SG_H - sg_h_main - 6
wf_mid = wf_y_start + wf_h // 2
for y in range(wf_h):
    for x in range(SG_W):
        px[SG_X + x, wf_y_start + y] = (15, 23, 42)
for x in range(SG_W):
    px[SG_X + x, wf_mid] = (60, 80, 110)
for x in range(SG_W):
    t = x / SG_W
    amp = (math.sin(t * 12) * 0.3 +
           math.exp(-((t - 0.2) ** 2) * 80) * 0.85 +
           math.exp(-((t - 0.42) ** 2) * 100) * 0.7 +
           math.exp(-((t - 0.7) ** 2) * 60) * 0.85 +
           math.sin(t * 90) * 0.12 +
           (random.random() - 0.5) * 0.08)
    half = int(abs(amp) * (wf_h // 2 - 4))
    for dy in range(-half, half + 1):
        yy = wf_mid + dy
        if 0 <= yy - wf_y_start < wf_h:
            px[SG_X + x, yy] = (20, 184, 166)

# ---------- right text ----------
title_font = ImageFont.truetype(FONT_BOLD, 64)
sub_font   = ImageFont.truetype(FONT_BOLD, 56)
desc_font  = ImageFont.truetype(FONT_REG, 26)
url_font   = ImageFont.truetype(FONT_BOLD, 30)
chip_font  = ImageFont.truetype(FONT_BOLD, 18)

# ---------- 우측 상단 미니 로고 (헤더 SVG 모방) ----------
LOGO_X, LOGO_Y, LOGO_R = 660, 138, 30
# outer disc with gradient (간단히 단색 → 흰 테두리)
for ang_y in range(-LOGO_R, LOGO_R + 1):
    for ang_x in range(-LOGO_R, LOGO_R + 1):
        if ang_x * ang_x + ang_y * ang_y <= LOGO_R * LOGO_R:
            t = (ang_x + LOGO_R + ang_y + LOGO_R) / (4 * LOGO_R)
            r = int(0x07 + (0x14 - 0x07) * t)
            g = int(0x3F + (0xB8 - 0x3F) * t)
            b = int(0x62 + (0xA6 - 0x62) * t)
            px[LOGO_X + ang_x, LOGO_Y + ang_y] = (r, g, b)
# 작은 파형 흰 라인
import math as _m
wf_pts = []
for i in range(-LOGO_R + 5, LOGO_R - 4):
    t = (i + LOGO_R - 5) / (2 * (LOGO_R - 5))
    amp = (_m.sin(t * 14) * 0.35 +
           _m.exp(-((t - 0.35) ** 2) * 50) * 0.7 +
           _m.exp(-((t - 0.7) ** 2) * 45) * 0.6) * 0.45
    y_off = int(amp * (LOGO_R * 0.55))
    wf_pts.append((LOGO_X + i, LOGO_Y - y_off))
for j in range(len(wf_pts) - 1):
    draw.line([wf_pts[j], wf_pts[j+1]], fill="#FFFFFF", width=2)

# eyebrow badge (조금 아래로)
bbox = chip_font.getbbox("CLINICAL AUSCULTATION TRAINER")
bw = bbox[2] + 30
draw.rounded_rectangle([720, 120, 720 + bw, 158], radius=999, outline=(255,255,255), width=2)
draw.text((720 + 15, 130), "CLINICAL AUSCULTATION TRAINER", font=chip_font, fill="#FFFFFF")

# main title (영문 메인)
draw.text((620, 195), "Lung Sound Study", font=title_font, fill="#FFFFFF")
# 한글 부제 (메인 톤으로 크게)
draw.text((620, 275), "청진음 학습기", font=sub_font, fill="#A7F3D0")
# desc
draw.text((620, 365), "271개 임상 폐음 · 6 라벨", font=desc_font, fill="#E2E8F0")
draw.text((620, 405), "도감 · 퀴즈 · 비교 · 시각화", font=desc_font, fill="#E2E8F0")

# url box
draw.rounded_rectangle([620, 490, 990, 555], radius=12, fill=(8, 30, 55), outline=(255,255,255,80), width=1)
draw.text((640, 503), "lungsoundstudy.com", font=url_font, fill="#FFFFFF")

# label chips on left
labels = [("crackle", "#B45309"), ("wheezing", "#7C2D6F"), ("rhonchi", "#0F766E")]
cx, cy = 80, 445
for name, color in labels:
    tw = chip_font.getbbox(name)[2]
    cw = tw + 22
    draw.rounded_rectangle([cx, cy, cx + cw, cy + 30], radius=999, fill=color)
    draw.text((cx + 11, cy + 5), name, font=chip_font, fill="#FFFFFF")
    cx += cw + 8

img.save(OUT, "PNG", optimize=True)
print("Saved:", OUT)

# ---------- favicons ----------
def make_icon(size, path):
    icon = Image.new("RGB", (size, size))
    p = icon.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size)
            r = int(0x07 + (0x14 - 0x07) * t)
            g = int(0x3F + (0xB8 - 0x3F) * t)
            b = int(0x62 + (0xA6 - 0x62) * t)
            p[x, y] = (r, g, b)
    d = ImageDraw.Draw(icon)
    mid = size // 2
    x0, x1 = int(size * 0.12), int(size * 0.88)
    lw = max(1, size // 64)
    for x in range(x0, x1):
        t = (x - x0) / (x1 - x0)
        amp = (math.sin(t * 14) * 0.5 +
               math.exp(-((t - 0.35) ** 2) * 60) * 0.9 +
               math.exp(-((t - 0.7) ** 2) * 50) * 0.8) * 0.4
        h = int(abs(amp) * (size * 0.32))
        d.line([(x, mid - h), (x, mid + h)], fill="#A7F3D0", width=lw)
    icon.save(path, "PNG", optimize=True)

make_icon(32, ICON32)
make_icon(192, ICON192)
make_icon(180, ICON_APPLE)
print("Saved favicons:", ICON32, ICON192, ICON_APPLE)
