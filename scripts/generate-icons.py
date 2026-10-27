#!/usr/bin/env python3
"""Gera os ícones do PWA (PNG puro, sem dependências externas).

Motivo: cruz dourada sobre capa bordô, com um livro aberto em traço claro —
uma síntese visual do Ofício Diário.
"""
from __future__ import annotations

import struct
import zlib
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "icons"

BORDO = (74, 21, 59)
BORDO_CLARO = (96, 32, 78)
DOURADO = (212, 162, 74)
MARFIM = (250, 247, 242)


def blend(dst, src, alpha):
    return tuple(round(d * (1 - alpha) + s * alpha) for d, s in zip(dst, src))


class Canvas:
    def __init__(self, size: int, background=BORDO):
        self.size = size
        self.pixels = [[background for _ in range(size)] for _ in range(size)]

    def fill_rect(self, x0, y0, x1, y1, color, alpha=1.0):
        for y in range(max(0, int(y0)), min(self.size, int(y1))):
            row = self.pixels[y]
            for x in range(max(0, int(x0)), min(self.size, int(x1))):
                row[x] = blend(row[x], color, alpha)

    def fill_round_rect(self, x0, y0, x1, y1, radius, color, alpha=1.0):
        for y in range(max(0, int(y0)), min(self.size, int(y1))):
            for x in range(max(0, int(x0)), min(self.size, int(x1))):
                dx = min(x - x0, x1 - 1 - x)
                dy = min(y - y0, y1 - 1 - y)
                if dx < radius and dy < radius:
                    cx = x0 + radius if dx == x - x0 else x1 - radius
                    cy = y0 + radius if dy == y - y0 else y1 - radius
                    if (x - cx) ** 2 + (y - cy) ** 2 > radius ** 2:
                        continue
                self.pixels[y][x] = blend(self.pixels[y][x], color, alpha)

    def gradient(self, top_color, bottom_color):
        for y in range(self.size):
            ratio = y / max(1, self.size - 1)
            color = blend(top_color, bottom_color, ratio)
            self.pixels[y] = [color for _ in range(self.size)]

    def to_png(self, path: Path):
        raw = bytearray()
        for row in self.pixels:
            raw.append(0)
            for pixel in row:
                raw.extend(pixel)

        def chunk(tag: bytes, data: bytes) -> bytes:
            return (
                struct.pack(">I", len(data))
                + tag
                + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
            )

        header = struct.pack(">IIBBBBB", self.size, self.size, 8, 2, 0, 0, 0)
        png = (
            b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", header)
            + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
            + chunk(b"IEND", b"")
        )
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(png)
        print(f"  · {path.relative_to(OUT.parent.parent)} ({len(png) / 1024:.1f} kB)")


def draw_icon(size: int, maskable: bool) -> Canvas:
    canvas = Canvas(size)
    canvas.gradient(BORDO_CLARO, BORDO)
    unit = size / 100

    # Moldura dourada (recuada no modo maskable para preservar a área segura).
    inset = 22 if maskable else 12
    canvas.fill_round_rect(inset * unit, inset * unit, size - inset * unit, size - inset * unit, 4 * unit, DOURADO, 0.55)
    canvas.fill_round_rect((inset + 1.6) * unit, (inset + 1.6) * unit, size - (inset + 1.6) * unit, size - (inset + 1.6) * unit, 3 * unit, BORDO_CLARO, 1.0)

    # Cruz.
    cx = size / 2
    bar_w = 8 * unit
    canvas.fill_rect(cx - bar_w / 2, 20 * unit, cx + bar_w / 2, 62 * unit, DOURADO)
    canvas.fill_rect(cx - 20 * unit, 33 * unit, cx + 20 * unit, 33 * unit + bar_w, DOURADO)

    # Livro aberto (duas páginas em marfim).
    page_top = 66 * unit
    page_bottom = 82 * unit
    canvas.fill_round_rect(cx - 26 * unit, page_top, cx - 1.5 * unit, page_bottom, 1.5 * unit, MARFIM, 0.92)
    canvas.fill_round_rect(cx + 1.5 * unit, page_top, cx + 26 * unit, page_bottom, 1.5 * unit, MARFIM, 0.92)
    canvas.fill_rect(cx - 1.5 * unit, page_top, cx + 1.5 * unit, page_bottom, BORDO, 1.0)

    # Linhas de texto sugeridas.
    for offset, width in ((8, 16), (12, 19), (16, 13)):
        y = page_top + offset * unit
        canvas.fill_rect(cx - (width + 2) * unit, y, cx - 4 * unit, y + 1.6 * unit, BORDO, 0.55)
        canvas.fill_rect(cx + 4 * unit, y, cx + (width + 2) * unit, y + 1.6 * unit, BORDO, 0.55)

    return canvas


SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Ofício Diário">
  <defs>
    <linearGradient id="capa" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#60204e"/>
      <stop offset="1" stop-color="#4a153b"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="28" fill="url(#capa)"/>
  <rect x="62" y="62" width="388" height="388" rx="20" fill="none" stroke="#d4a24a" stroke-opacity="0.55" stroke-width="8"/>
  <rect x="330" y="102" width="41" height="215" fill="#d4a24a"/>
  <rect x="229" y="169" width="243" height="41" fill="#d4a24a"/>
  <rect x="124" y="338" width="126" height="82" rx="8" fill="#faf7f2" fill-opacity="0.92"/>
  <rect x="262" y="338" width="126" height="82" rx="8" fill="#faf7f2" fill-opacity="0.92"/>
  <rect x="248" y="338" width="16" height="82" fill="#4a153b"/>
</svg>
"""

if __name__ == "__main__":
    print("Gerando ícones…")
    draw_icon(192, maskable=False).to_png(OUT / "icon-192.png")
    draw_icon(512, maskable=False).to_png(OUT / "icon-512.png")
    draw_icon(512, maskable=True).to_png(OUT / "icon-maskable-512.png")
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "icon.svg").write_text(SVG, encoding="utf-8")
    print("  · public/icons/icon.svg")
