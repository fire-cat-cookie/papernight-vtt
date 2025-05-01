export const Util = {
  ListDistinct: function (values: string[], separator: string): string {
    return Array.from(new Set(values)).join(separator);
  },

  Clamp: function (value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
  },
};
