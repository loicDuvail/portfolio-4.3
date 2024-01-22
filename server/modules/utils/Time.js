class Time {
  static ms(duration) {
    return new TimeTranslator(duration);
  }
  static sec(duration) {
    return new TimeTranslator(duration * 1000);
  }
  static min(duration) {
    return new TimeTranslator(duration * 60_000);
  }
  static hour(duration) {
    return new TimeTranslator(duration * 3_600_000);
  }
  static day(duration) {
    return new TimeTranslator(duration * 24 * 3_600_000);
  }
}
class TimeTranslator {
  #ms;
  constructor(ms) {
    this.#ms = ms;
  }
  to(timeFormat) {
    switch (timeFormat) {
      case "ms":
        return this.#ms;
      case "sec":
        return this.#ms / 1000;
      case "min":
        return this.#ms / 60_000;
      case "hour":
        return this.#ms / (3600 * 1000);
      case "day":
        return this.#ms / (24 * 3600 * 1000);
    }
  }
}

module.exports = Time;
