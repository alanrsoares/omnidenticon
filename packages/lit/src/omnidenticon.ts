import { LitElement, html } from "lit";
import { createRef } from "lit/directives/ref.js";
import { customElement, property } from "lit/decorators.js";

import { DEFAULT_COLORS, OmnidenticonGenerator } from "@omnidenticon/core";
import { addressToNumber } from "@omnidenticon/core/utils";

const WATCHED_PROPERTIES = ["address", "prefix", "diameter", "shapes"];

@customElement("omni-identicon")
export class Omnidenticon extends LitElement {
  @property({ type: String })
  address = "";

  @property({ type: String })
  prefix = "";

  @property({ type: Number })
  diameter = 100;

  @property({ type: Number })
  shapes = 5;

  @property()
  ref = createRef();

  get hasPrefix() {
    return Boolean(this.prefix);
  }

  get seed() {
    return addressToNumber(this.address, this.prefix);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (WATCHED_PROPERTIES.some((prop) => changedProperties.has(prop))) {
      const generator = new OmnidenticonGenerator(
        this.seed,
        this.diameter,
        this.shapes,
        DEFAULT_COLORS
      );

      const target = this.renderRoot.querySelector("div");

      target?.replaceWith(generator.generateIdenticon());
    }
  }

  render() {
    return html`<div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": Omnidenticon;
  }
}
