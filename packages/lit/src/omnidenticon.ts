import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DEFAULT_COLORS, OmnidenticonGenerator } from "@omnidenticon/core";
import { addressToNumber } from "@omnidenticon/core/utils";

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

  get hasPrefix() {
    return Boolean(this.prefix);
  }

  get seed() {
    return addressToNumber(this.address, this.prefix);
  }

  get generator() {
    return new OmnidenticonGenerator(
      this.seed,
      this.diameter,
      this.shapes,
      DEFAULT_COLORS
    );
  }

  render() {
    return this.generator.generateIdenticon();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": Omnidenticon;
  }
}
