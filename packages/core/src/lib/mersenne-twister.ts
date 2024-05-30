const N = 624;
const M = 397;
const MATRIX_A = 0x9908b0df;
const UPPER_MASK = 0x80000000;
const LOWER_MASK = 0x7fffffff;
const INIT_MULTIPLIER = 1812433253;
const INIT_DIVIDER = 4294967296;

export class MersenneTwister {
  private mt: Uint32Array;
  private index: number;

  constructor(seed: number) {
    this.mt = new Uint32Array(N);
    this.index = N;
    this.init(seed);
  }

  private init(seed: number) {
    this.mt[0] = seed >>> 0;
    for (let i = 1; i < N; i++) {
      const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
      this.mt[i] =
        (((s >>> 16) * INIT_MULTIPLIER) << 16) +
        (s & 0xffff) * INIT_MULTIPLIER +
        i;
    }
  }

  private generate() {
    for (let i = 0; i < N; i++) {
      const y = (this.mt[i] & UPPER_MASK) | (this.mt[(i + 1) % N] & LOWER_MASK);
      this.mt[i] = this.mt[(i + M) % N] ^ (y >>> 1);
      if (y % 2 !== 0) {
        this.mt[i] ^= MATRIX_A;
      }
    }
  }

  public random(): number {
    if (this.index >= N) {
      this.generate();
      this.index = 0;
    }
    let y = this.mt[this.index++];
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;
    return (y >>> 0) / INIT_DIVIDER;
  }
}

export default MersenneTwister;
