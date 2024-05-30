import { LitElement, html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { customElement, property } from "lit/decorators.js";

import { DEFAULT_COLORS, OmnidenticonGenerator } from "@omnidenticon/core";
import { addressToNumber } from "@omnidenticon/core/utils";

@customElement("omni-identicon")
export class Omnidenticon extends LitElement {
  @property()
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

  firstUpdated(): void {
    const generator = new OmnidenticonGenerator(
      this.seed,
      this.diameter,
      this.shapes,
      DEFAULT_COLORS
    );

    const identiconContainer = generator.generateIdenticon();

    this.ref.value?.replaceWith(identiconContainer);
  }

  render() {
    return html`<div ${ref(this.ref)}></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": Omnidenticon;
  }
}
