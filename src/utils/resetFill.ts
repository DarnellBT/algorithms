import { COLOUR } from "@utils/colour";

export function resetFill(
  elementType: string,
  elementValues: number[],
  elementSVG: string
): void {
  let element: HTMLElement | null;

  for (let i = 0; i < elementValues.length; i++) {
    element = document.getElementById(`${elementType}-${i}-${elementSVG}`);

    if (element === null) {
      continue; // if element is the same as null there is not an element with the id passed into the "document.getElementById()" is not present within document (the page's html)
    }

    element.setAttribute("fill", COLOUR.BLUE);
    element.setAttribute("opacity", "1");
  }
}
