// converts ',' delimited text into an array of numbered values
export function splitValues(text: string, delimiter: string = ","): number[] {
  const values: number[] = text
    .split(delimiter)
    .map((value: string): number => parseFloat(value));

  return values;
}
