import MersenneTwister from "./mersenne-twister";
import Color from "./color";

export const DEFAULT_COLORS = [
  "#01888C",
  "#FC7500",
  "#034F5D",
  "#F73F01",
  "#FC1960",
  "#C7144C",
  "#F3C100",
  "#1598F2",
  "#2465E1",
  "#F19E02",
];

const SVGNS = "http://www.w3.org/2000/svg";

export class OmnidenticonGenerator {
  private generator: MersenneTwister;

  constructor(
    private seed: number,
    private diameter: number,
    private shapes: number,
    private colors: string[]
  ) {
    this.generator = new MersenneTwister(this.seed);
  }

  private genColor(remainingColors: string[]): string {
    this.generator.random();
    const idx = Math.floor(remainingColors.length * this.generator.random());
    return remainingColors.splice(idx, 1)[0];
  }

  private hueShift(colors: string[]): string[] {
    const wobble = 30;
    const amount = this.generator.random() * 30 - wobble / 2;
    return colors.map((hex) => {
      const color = new Color(hex);
      return color.rotate(amount).hex();
    });
  }

  private newPaper(color: string): HTMLDivElement {
    const container = document.createElement("div");
    container.style.borderRadius = `${this.diameter / 2}px`;
    container.style.overflow = "hidden";
    container.style.padding = "0px";
    container.style.margin = "0px";
    container.style.width = `${this.diameter}px`;
    container.style.height = `${this.diameter}px`;
    container.style.display = "inline-block";
    container.style.background = color;
    return container;
  }

  private createGradient(svg: SVGSVGElement, colors: string[]): string {
    const gradientId = `grad${Math.round(this.generator.random() * 1000000)}`;
    const gradient = document.createElementNS(SVGNS, "linearGradient");
    gradient.setAttribute("id", gradientId);
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "100%");
    gradient.setAttribute("y2", "100%");

    colors.forEach((color, index) => {
      const stop = document.createElementNS(SVGNS, "stop");
      stop.setAttribute("offset", `${index * (100 / (colors.length - 1))}%`);
      stop.setAttribute("stop-color", color);
      gradient.appendChild(stop);
    });

    svg.appendChild(gradient);
    return gradientId;
  }

  private genShape(
    remainingColors: string[],
    i: number,
    total: number,
    svg: SVGSVGElement
  ) {
    const center = this.diameter / 2;
    const shape = document.createElementNS(SVGNS, "rect");

    const firstRot = this.generator.random();
    const angle = Math.PI * 2 * firstRot;
    const velocity =
      (this.diameter / total) * this.generator.random() +
      (i * this.diameter) / total;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    const translate = `translate(${tx} ${ty})`;
    const secondRot = this.generator.random();
    const rot = firstRot * 360 + secondRot * 180;
    const rotate = `rotate(${rot.toFixed(1)} ${center} ${center})`;
    const transform = `${translate} ${rotate}`;

    setAttributeNS(shape, {
      x: 0,
      y: 0,
      width: this.diameter,
      height: this.diameter,
      transform,
    });

    const shouldAddGradient = this.generator.random() > 0.5; // 50% chance to use gradient
    if (shouldAddGradient) {
      const gradientId = this.createGradient(svg, [
        this.genColor(remainingColors),
        this.genColor(remainingColors),
      ]);
      shape.setAttributeNS(null, "fill", `url(#${gradientId})`);
    } else {
      const fill = this.genColor(remainingColors);
      shape.setAttributeNS(null, "fill", fill);
    }

    svg.appendChild(shape);
  }

  public generateIdenticon(): HTMLDivElement {
    const remainingColors = this.hueShift([...this.colors]);
    const container = this.newPaper(this.genColor(remainingColors));
    const svg = document.createElementNS(SVGNS, "svg");

    setAttributeNS(svg, {
      x: 0,
      y: 0,
      width: this.diameter,
      height: this.diameter,
    });

    container.appendChild(svg);
    for (let i = 0; i < this.shapes - 1; i++) {
      this.genShape(remainingColors, i, this.shapes - 1, svg);
    }
    return container;
  }
}

function setAttributeNS<T extends SVGElement>(
  el: T,
  obj: Record<string, string | number>
) {
  for (let key in obj) {
    el.setAttributeNS(null, key, String(obj[key]));
  }

  return el;
}
