export class HeuristicValidator {
  isNonReadableString (value: string): boolean {
    if (value.length <= 100) return false;
    let cntNonReaddable = 0;
    for (let i = 0; i < value.length; i++) {
      const cur = value.charCodeAt(i);
      if (cur < 32 || cur >= 127) cntNonReaddable++;
    }
    return (cntNonReaddable >= Math.floor(value.length / 2));
  }
}
