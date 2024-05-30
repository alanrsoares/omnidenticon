// color.ts
type RGB = {
  r: number;
  g: number;
  b: number;
};

type HSL = {
  h: number;
  s: number;
  l: number;
};

export class Color {
  private r: number;
  private g: number;
  private b: number;

  constructor(hex: string) {
    const rgb = Color.hexToRgb(hex);
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
  }

  static new(hex: string) {
    return new Color(hex);
  }

  static hexToRgb(hex: string): RGB {
    let trimmedHex = hex.replace(/^#/, "");
    if (trimmedHex.length === 3) {
      trimmedHex = trimmedHex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    const num = parseInt(trimmedHex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }

  static rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private static rgbToHsl({ r, g, b }: RGB): HSL {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h: h * 360, s, l };
  }

  private static hslToRgb({ h, s, l }: HSL): RGB {
    let r: number, g: number, b: number;
    h /= 360;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  rotate(degrees: number): Color {
    const hsl = Color.rgbToHsl({ r: this.r, g: this.g, b: this.b });
    hsl.h = (hsl.h + degrees) % 360;
    const { r, g, b } = Color.hslToRgb(hsl);
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }

  hex(): string {
    return Color.rgbToHex(this.r, this.g, this.b);
  }
}

export default Color;
