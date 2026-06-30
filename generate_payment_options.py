from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math


ROOT = Path(__file__).resolve().parent
FIRST_REF = Path(r"C:\Users\TTNGAM~1\AppData\Local\Temp\codex-clipboard-607666bf-e625-465a-b5ba-a16a3c272a05.png")
MMQR_REF = Path(r"C:\Users\TTNGAM~1\AppData\Local\Temp\codex-clipboard-77fa71ad-33c3-427b-9395-77bd8fd9ecc8.png")
LOGO = ROOT / "assets" / "b3-logo-4k.png"
OUT_DIR = ROOT / "assets" / "designs"
OUT_DIR.mkdir(parents=True, exist_ok=True)

OUT_PNG = OUT_DIR / "b3-payment-options-20260622.png"
OUT_JPG = OUT_DIR / "b3-payment-options-20260622.jpg"


def font(name, size):
    candidates = [
        Path(r"C:\Windows\Fonts") / name,
        Path(r"C:\Windows\Fonts\arial.ttf"),
        Path(r"C:\Windows\Fonts\segoeui.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


FONT_TITLE = font("georgiab.ttf", 74)
FONT_SUBTITLE = font("segoeui.ttf", 25)
FONT_CARD_TITLE = font("segoeuib.ttf", 42)
FONT_LABEL = font("segoeui.ttf", 24)
FONT_BIG = font("segoeuib.ttf", 42)
FONT_MED = font("segoeui.ttf", 34)
FONT_SMALL = font("segoeui.ttf", 21)
FONT_LOGO = font("segoeuib.ttf", 36)


def rounded_rectangle(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def center_text(draw, box, text, fnt, fill, anchor="mm", spacing=8):
    x1, y1, x2, y2 = box
    lines = text.split("\n")
    heights = [draw.textbbox((0, 0), line, font=fnt)[3] for line in lines]
    total = sum(heights) + spacing * (len(lines) - 1)
    y = (y1 + y2 - total) / 2
    for line, h in zip(lines, heights):
        bbox = draw.textbbox((0, 0), line, font=fnt)
        x = (x1 + x2) / 2
        draw.text((x, y + h / 2), line, font=fnt, fill=fill, anchor=anchor)
        y += h + spacing


def paste_contain(base, image, box, padding=0, radius=0, bg=None):
    x1, y1, x2, y2 = box
    x1 += padding
    y1 += padding
    x2 -= padding
    y2 -= padding
    target_w, target_h = x2 - x1, y2 - y1
    img = image.convert("RGBA")
    img.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)
    layer = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    if bg is not None:
        back = Image.new("RGBA", (target_w, target_h), bg)
        if radius:
            mask = Image.new("L", (target_w, target_h), 0)
            d = ImageDraw.Draw(mask)
            d.rounded_rectangle((0, 0, target_w, target_h), radius=radius, fill=255)
            layer.alpha_composite(back)
            layer.putalpha(mask)
        else:
            layer.alpha_composite(back)
    px = (target_w - img.width) // 2
    py = (target_h - img.height) // 2
    layer.alpha_composite(img, (px, py))
    base.alpha_composite(layer, (x1, y1))


def extract_mmqr_qr(path):
    img = Image.open(path).convert("RGB")
    # The provided MMQR reference keeps the actual QR centered in the middle
    # of a tall poster. Use a fixed crop so the final payment card stays
    # readable instead of embedding the full poster.
    return img.crop((270, 895, 825, 1450))
    gray = img.convert("L")
    # QR is the largest dense dark region in the lower middle of the MMQR reference.
    mask = gray.point(lambda p: 255 if p < 80 else 0)
    pix = mask.load()
    w, h = mask.size
    visited = set()
    best = None
    for y in range(int(h * 0.35), int(h * 0.78), 3):
        for x in range(int(w * 0.15), int(w * 0.85), 3):
            if pix[x, y] == 0 or (x, y) in visited:
                continue
            stack = [(x, y)]
            visited.add((x, y))
            xs, ys = [], []
            while stack:
                cx, cy = stack.pop()
                xs.append(cx)
                ys.append(cy)
                for nx, ny in ((cx + 3, cy), (cx - 3, cy), (cx, cy + 3), (cx, cy - 3)):
                    if 0 <= nx < w and 0 <= ny < h and pix[nx, ny] and (nx, ny) not in visited:
                        visited.add((nx, ny))
                        stack.append((nx, ny))
            if len(xs) < 50:
                continue
            box = (min(xs), min(ys), max(xs), max(ys))
            bw, bh = box[2] - box[0], box[3] - box[1]
            area = bw * bh
            if bw > 200 and bh > 200 and 0.75 < bw / max(1, bh) < 1.25:
                if best is None or area > best[0]:
                    best = (area, box)
    if not best:
        return img.crop((250, 900, 820, 1470))
    _, (x1, y1, x2, y2) = best
    pad = 28
    x1, y1 = max(0, x1 - pad), max(0, y1 - pad)
    x2, y2 = min(w, x2 + pad), min(h, y2 + pad)
    return img.crop((x1, y1, x2, y2))


def extract_kbzpay_qr(path):
    img = Image.open(path).convert("RGB")
    # Top-right QR from the existing payment-options reference.
    return img.crop((555, 285, 755, 485))


def soft_floral_background(size):
    w, h = size
    bg = Image.new("RGBA", size, (255, 249, 245, 255))
    draw = ImageDraw.Draw(bg, "RGBA")
    # soft corner washes
    palettes = [
        ((242, 23, 139, 40), (-80, -50), 360),
        ((255, 199, 80, 38), (w - 260, -80), 330),
        ((40, 130, 95, 25), (w - 180, h - 220), 260),
        ((245, 95, 120, 22), (-120, h - 250), 300),
    ]
    for color, pos, radius in palettes:
        layer = Image.new("RGBA", size, (0, 0, 0, 0))
        d = ImageDraw.Draw(layer, "RGBA")
        x, y = pos
        d.ellipse((x, y, x + radius, y + radius), fill=color)
        bg.alpha_composite(layer.filter(ImageFilter.GaussianBlur(55)))
    draw_floral_corner(draw, 110, 130, 1, 1)
    draw_floral_corner(draw, w - 110, 130, -1, 1)
    draw_floral_corner(draw, 105, h - 130, 1, -1)
    draw_floral_corner(draw, w - 105, h - 130, -1, -1)
    return bg


def draw_leaf(draw, cx, cy, angle, scale, fill=(91, 145, 111, 80), outline=(67, 122, 91, 95)):
    length = 42 * scale
    width = 18 * scale
    a = math.radians(angle)
    dx, dy = math.cos(a), math.sin(a)
    px, py = -dy, dx
    tip = (cx + dx * length, cy + dy * length)
    base = (cx - dx * length * 0.28, cy - dy * length * 0.28)
    p1 = (cx + px * width, cy + py * width)
    p2 = (cx - px * width, cy - py * width)
    draw.polygon([base, p1, tip, p2], fill=fill, outline=outline)
    draw.line((base[0], base[1], tip[0], tip[1]), fill=outline, width=max(1, int(2 * scale)))


def draw_watercolor_flower(draw, cx, cy, scale, color):
    for i in range(7):
        a = math.radians(i * 51 + 8)
        px = cx + math.cos(a) * 18 * scale
        py = cy + math.sin(a) * 12 * scale
        draw.ellipse(
            (px - 22 * scale, py - 15 * scale, px + 22 * scale, py + 15 * scale),
            fill=color,
            outline=(216, 99, 137, 85),
            width=max(1, int(2 * scale)),
        )
    draw.ellipse((cx - 9 * scale, cy - 9 * scale, cx + 9 * scale, cy + 9 * scale), fill=(224, 164, 65, 130))


def draw_floral_corner(draw, cx, cy, sx, sy):
    stem = (151, 118, 71, 110)
    for offset, angle in [(-55, 28), (-18, 2), (28, -24), (62, -45)]:
        start = (cx, cy)
        end = (cx + sx * (95 + abs(offset) * 0.7), cy + sy * offset)
        draw.line((start[0], start[1], end[0], end[1]), fill=stem, width=3)
        draw_leaf(draw, (start[0] + end[0]) / 2, (start[1] + end[1]) / 2, sx * angle, 0.9)
        draw_watercolor_flower(draw, end[0], end[1], 0.82, (239, 24, 139, 95))
    for offset in (-35, 38):
        draw_leaf(draw, cx + sx * 52, cy + sy * offset, sx * (35 if offset < 0 else -35), 1.15, fill=(93, 159, 131, 70))


def make_wave_icon(size=110):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, "RGBA")
    for i in range(38, 0, -1):
        c = (0, 167 + i, 225, 34)
        draw.ellipse((size * 0.08 + i * 0.6, size * 0.08 + i * 0.25, size * 0.92 - i * 0.35, size * 0.92 - i * 0.15), fill=c)
    draw.ellipse((size * 0.2, size * 0.2, size * 0.85, size * 0.85), fill=(0, 155, 220, 230))
    draw.ellipse((size * 0.35, size * 0.43, size * 0.72, size * 0.78), fill=(26, 201, 235, 230))
    draw.ellipse((size * 0.48, size * 0.56, size * 0.68, size * 0.76), fill=(255, 255, 255, 225))
    return img


def draw_kbzpay_logo(draw, x, y, size=92):
    blue = (0, 91, 178, 255)
    draw.rounded_rectangle((x, y, x + size, y + size), radius=int(size * 0.18), fill=blue)
    cut = int(size * 0.18)
    draw.polygon([(x + size - cut, y), (x + size, y), (x + size, y + cut)], fill=(255, 255, 255, 255))
    draw.polygon([(x, y + size - cut), (x, y + size), (x + cut, y + size)], fill=(255, 255, 255, 255))
    draw.text((x + size * 0.5, y + size * 0.42), "KBZ", font=font("segoeuib.ttf", int(size * 0.26)), fill="white", anchor="mm")
    draw.text((x + size * 0.5, y + size * 0.68), "Pay", font=font("segoeuib.ttf", int(size * 0.26)), fill="white", anchor="mm")


def draw_aya_pay_logo(draw, x, y, scale=1.0):
    red = (219, 18, 68, 255)
    dark = (74, 78, 90, 255)
    draw.pieslice((x, y, x + 54 * scale, y + 54 * scale), 120, 300, fill=red)
    draw.ellipse((x + 14 * scale, y + 13 * scale, x + 49 * scale, y + 48 * scale), fill=(255, 255, 255, 255))
    draw.pieslice((x + 9 * scale, y + 8 * scale, x + 58 * scale, y + 57 * scale), 120, 300, fill=(235, 55, 85, 180))
    draw.text((x + 72 * scale, y + 28 * scale), "AYA PAY", font=font("segoeuib.ttf", int(28 * scale)), fill=dark, anchor="lm")


def draw_kbz_mark(draw, x, y, scale=1.0):
    red = (236, 31, 39, 255)
    blue = (17, 82, 168, 255)
    p1 = [(x, y + 88 * scale), (x + 60 * scale, y), (x + 120 * scale, y + 88 * scale)]
    p2 = [(x + 25 * scale, y + 74 * scale), (x + 60 * scale, y + 20 * scale), (x + 95 * scale, y + 74 * scale)]
    p3 = [(x + 45 * scale, y + 58 * scale), (x + 60 * scale, y + 35 * scale), (x + 75 * scale, y + 58 * scale)]
    draw.line(p1 + [p1[0]], fill=red, width=int(9 * scale), joint="curve")
    draw.line(p2 + [p2[0]], fill=blue, width=int(8 * scale), joint="curve")
    draw.line(p3 + [p3[0]], fill=red, width=int(7 * scale), joint="curve")


def main():
    canvas = soft_floral_background((1600, 1100))
    draw = ImageDraw.Draw(canvas, "RGBA")

    pink = (236, 19, 137, 255)
    ink = (43, 33, 38, 255)
    muted = (105, 91, 95, 255)
    line = (227, 190, 207, 255)
    card_bg = (255, 253, 250, 237)

    logo = Image.open(LOGO).convert("RGBA")
    paste_contain(canvas, logo, (610, 40, 990, 205))
    draw.text((800, 235), "Payment Options", font=FONT_TITLE, fill=pink, anchor="mm")
    draw.text((800, 288), "Scan or transfer with your preferred payment method", font=FONT_SUBTITLE, fill=muted, anchor="mm")

    # Main card area
    panel = (70, 330, 1530, 1030)
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow, "RGBA")
    sd.rounded_rectangle((panel[0] + 8, panel[1] + 10, panel[2] + 8, panel[3] + 10), radius=30, fill=(45, 27, 33, 35))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(10)))
    rounded_rectangle(draw, panel, 30, (255, 255, 255, 222), outline=(238, 208, 218, 255), width=3)

    gap = 22
    card_w = (panel[2] - panel[0] - 3 * gap) // 2
    card_h = (panel[3] - panel[1] - 3 * gap) // 2
    cards = [
        (panel[0] + gap, panel[1] + gap, panel[0] + gap + card_w, panel[1] + gap + card_h),
        (panel[0] + 2 * gap + card_w, panel[1] + gap, panel[0] + 2 * gap + 2 * card_w, panel[1] + gap + card_h),
        (panel[0] + gap, panel[1] + 2 * gap + card_h, panel[0] + gap + card_w, panel[1] + 2 * gap + 2 * card_h),
        (panel[0] + 2 * gap + card_w, panel[1] + 2 * gap + card_h, panel[0] + 2 * gap + 2 * card_w, panel[1] + 2 * gap + 2 * card_h),
    ]

    for idx, card in enumerate(cards):
        outline = (246, 193, 215, 255) if idx == 0 else line
        rounded_rectangle(draw, card, 24, card_bg, outline=outline, width=3)

    # MMQR
    mmqr_qr = extract_mmqr_qr(MMQR_REF)
    x1, y1, x2, y2 = cards[0]
    qr_box = (x1 + 42, y1 + 42, x1 + 360, y2 - 35)
    rounded_rectangle(draw, qr_box, 18, (255, 255, 255, 255), outline=(231, 219, 213, 255), width=2)
    paste_contain(canvas, mmqr_qr, qr_box, padding=14)
    draw.text((x1 + 405, y1 + 112), "Scan here", font=FONT_BIG, fill=ink, anchor="la")
    draw.text((x1 + 405, y1 + 165), "MMQR", font=FONT_MED, fill=(21, 72, 142, 255), anchor="la")
    draw_aya_pay_logo(draw, x1 + 405, y1 + 192, 0.78)
    draw.text((x1 + 405, y1 + 275), "Name: B3 FLORAL", font=FONT_LABEL, fill=pink, anchor="la")

    # KBZ Pay
    kbz_qr = extract_kbzpay_qr(FIRST_REF)
    x1, y1, x2, y2 = cards[1]
    draw_kbzpay_logo(draw, x1 + 38, y1 + 42, 96)
    draw.text((x1 + 158, y1 + 72), "KBZPay", font=FONT_CARD_TITLE, fill=(0, 91, 178, 255), anchor="la")
    kbz_qr_box = (x1 + 42, y1 + 128, x1 + 292, y2 - 28)
    rounded_rectangle(draw, kbz_qr_box, 16, (255, 255, 255, 255), outline=(231, 219, 213, 255), width=2)
    paste_contain(canvas, kbz_qr, kbz_qr_box, padding=10)
    draw.text((x1 + 330, y1 + 162), "09257195657", font=FONT_BIG, fill=ink, anchor="la")
    draw.text((x1 + 330, y1 + 218), "Nang Hla Htay", font=FONT_MED, fill=muted, anchor="la")
    draw.text((x1 + 330, y1 + 270), "Scan or transfer", font=FONT_SMALL, fill=(150, 103, 112, 255), anchor="la")

    # Wave Money
    x1, y1, x2, y2 = cards[2]
    wave = make_wave_icon(115)
    canvas.alpha_composite(wave, (x1 + 38, y1 + 40))
    draw.text((x1 + 165, y1 + 78), "Wave Money", font=FONT_CARD_TITLE, fill=(18, 29, 35, 255), anchor="la")
    draw.text((x1 + 40, y1 + 175), "09788888860", font=FONT_BIG, fill=ink, anchor="la")
    draw.text((x1 + 40, y1 + 232), "Nang Lin Lin Kyi", font=FONT_MED, fill=muted, anchor="la")

    # KBZ Bank
    x1, y1, x2, y2 = cards[3]
    draw_kbz_mark(draw, x1 + 48, y1 + 46, 0.95)
    draw.text((x1 + 190, y1 + 83), "KBZ BANK", font=FONT_CARD_TITLE, fill=(237, 29, 38, 255), anchor="la")
    draw.text((x1 + 42, y1 + 175), "18751199925106901", font=FONT_BIG, fill=ink, anchor="la")
    draw.text((x1 + 42, y1 + 232), "Mg Sai Lao Main", font=FONT_MED, fill=muted, anchor="la")

    # footer
    draw.text((800, 1060), "B3 Floral Shop  |  Precious ur Smile", font=FONT_SMALL, fill=(142, 91, 111, 255), anchor="mm")

    rgb = canvas.convert("RGB")
    rgb.save(OUT_PNG, quality=95)
    rgb.save(OUT_JPG, quality=94, subsampling=0)
    print(OUT_PNG)
    print(OUT_JPG)


if __name__ == "__main__":
    main()
