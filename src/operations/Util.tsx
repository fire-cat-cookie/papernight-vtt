export const Util = {
  ListDistinct: function (values: string[], separator: string): string {
    return Array.from(new Set(values)).join(separator);
  },

  Clamp: function (value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
  },

  NumberToWord: function (value: number) {
    const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    if (value > 9) {
      return value;
    } else return words[value - 1];
  },

  Sequence: function (first: number, last: number) {
    return Array(first + last - 1)
      .fill(first)
      .map((e, i) => i + 1);
  },
};
