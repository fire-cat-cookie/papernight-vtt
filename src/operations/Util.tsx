export const Util = {
  ListDistinct: function (values: string[], separator: string): string {
    return Array.from(new Set(values)).join(separator);
  },
};
