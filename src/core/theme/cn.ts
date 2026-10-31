export function cn(...classes: Array<string | false | undefined>): string {
  return classes.filter((value): value is string => Boolean(value)).join(' ');
}
