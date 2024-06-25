import * as React from "react";
import { Link } from "react-router-dom";
// utilities
import { COLOUR } from "@utils/colour";
import { resetFill } from "@utils/resetFill";
import { splitValues } from "@utils/splitValues";
// components
import SortBar from "@components/SortBar";

type BubbleSortPropType = {};

type BubbleSortStateType = {
  values: string;
  sortBarPositions: number[];
  sortBars: React.ReactElement<SortBar>[];
  isSorting: boolean;
  animationSpeed: number;
  sortedText: string;
};

type SortBarAnimationType = {
  orderPos1: number; // element orderPos1 (moves right)
  orderPos2: number; // element orderPos2 (moves left)
};

class BubbleSort extends React.Component<
  BubbleSortPropType,
  BubbleSortStateType
> {
  private barValues: number[] = [2, 7, 5, 8, 3, 11, 2]; // default values for sorting algorithm that will be sorted
  private veiwBoxWidth: number = this.barValues.length * 25;
  private sortBarXPositions: number[] = this.barValues.map(
    (_: number, index: number): number => index * 20
  );

  constructor(props: BubbleSortPropType) {
    super(props); //no props are passed to componenet
    this.state = {
      values: this.barValues.toString(), // this is the number values entered by the user in string format (changes when user text input changes)
      sortBarPositions: this.sortBarXPositions, // this is the x (svg co-ordinate) position of each SortBar
      sortBars: this.setSortBarValues(), // this an array of all SortBar componenets
      isSorting: false,
      animationSpeed: 10,
      sortedText: "",
    };
  }

  setValues(inputValues: string): void {
    this.setState({
      values: inputValues,
    });
  }

  setStateSortBarValues(): void {
    this.setState({
      sortBars: this.setSortBarValues(),
    });
  }

  setStateIsSorting(inputIsSorting: boolean): void {
    this.setState({
      isSorting: inputIsSorting,
    });
  }

  setAnimationSpeed(inputAnimationSpeed: number): void {
    this.setState({
      animationSpeed: inputAnimationSpeed,
    });
  }

  setSortedText(inputSortedText: string): void {
    this.setState({
      sortedText: inputSortedText,
    });
  }

  setSortBarValues(): React.ReactElement<SortBar>[] {
    const maxHeight: number = Math.max(...this.barValues);
    const bars: React.ReactElement<SortBar>[] = this.barValues.map(
      (value: number, orderPos: number): React.ReactElement<SortBar> => {
        const barHeight: number = (value * 100) / maxHeight; // sets the bar height for each SortBar (the tallest bar scales to 100, each other bar scales relative to the tallest bar)

        return (
          <SortBar
            key={orderPos.toString()}
            id={`SortBar-${orderPos}`} // id format: "{Element}-{orderPos}"
            xPosition={orderPos * 20}
            height={barHeight}
            value={value}
          />
        );
      }
    );

    return bars;
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault(); // prevents the page from reloading on submit
    this.setSortedText("");

    const splitNumberValues: number[] = splitValues(this.state.values); // converts user submitted text into an array of numbers

    if (splitNumberValues == this.barValues) {
      return; // prevents unnecessary rerender
    }

    if (splitNumberValues.includes(NaN)) {
      return;
    }

    if (splitNumberValues.some((value: number): boolean => value <= 0)) {
      return;
    }

    this.barValues = splitNumberValues;
    this.veiwBoxWidth = this.barValues.length * 25;
    this.setStateSortBarValues();
  }

  async handleSort(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    this.setSortedText("");
    const delay = (): Promise<number> =>
      new Promise<number>((handler: TimerHandler): void => {
        const timeoutPeriod: number = this.state.animationSpeed * 25;

        setTimeout(handler, timeoutPeriod);
      });
    let SortBarRect1: HTMLElement | null;
    let SortBarRect2: HTMLElement | null;
    let SortBarRectFinished: HTMLElement | null = null;

    this.handleSubmit(event);
    resetFill("SortBar", this.barValues, "rect");
    this.setStateIsSorting(true);

    await delay();

    for (let i = 0; i < this.barValues.length - 1; i++) {
      for (let j = 0; j < this.barValues.length - i - 1; j++) {
        SortBarRect1 = document.getElementById(`SortBar-${j}-rect`);
        SortBarRectFinished = SortBarRect2 = document.getElementById(
          `SortBar-${j + 1}-rect`
        ); // SortBarRectFinished will change until at the end of loop

        if (SortBarRect1 === null || SortBarRect2 === null) {
          continue;
        }

        SortBarRect1.setAttribute("fill", COLOUR.GREEN);
        SortBarRect2.setAttribute("fill", COLOUR.RED);

        if (this.barValues[j] > this.barValues[j + 1]) {
          SortBarRect1.setAttribute("fill", COLOUR.GREEN);
          SortBarRect2.setAttribute("fill", COLOUR.RED);

          await delay();

          this.animate({
            orderPos1: j,
            orderPos2: j + 1,
          });
        }

        await delay();

        SortBarRect1.setAttribute("fill", COLOUR.BLUE);
        SortBarRect2.setAttribute("fill", COLOUR.BLUE);

        await delay();
      }

      if (SortBarRectFinished === null) {
        continue;
      }

      SortBarRectFinished.setAttribute("fill", COLOUR.YELLOW);

      await delay();
    }

    resetFill("SortBar", this.barValues, "rect");
    this.setSortedText("Sorted");
    this.setStateIsSorting(false);
  }

  animate(animation: SortBarAnimationType): void {
    let element1: HTMLElement | null = document.getElementById(
      `SortBar-${animation.orderPos1}`
    );
    let element2: HTMLElement | null = document.getElementById(
      `SortBar-${animation.orderPos2}`
    );

    if (element1 === null || element2 === null) {
      return;
    }

    let pos: number = 1;
    let intervalId: number = setInterval((): void => {
      if (element1 === null || element2 === null) {
        return; // this check is redundent only used to avoid warning message
      }

      if (pos === 20) {
        element1.setAttribute("transform", `translate(0)`);
        element2.setAttribute("transform", `translate(0)`);
        [
          this.barValues[animation.orderPos1],
          this.barValues[animation.orderPos2],
        ] = [
          this.barValues[animation.orderPos2],
          this.barValues[animation.orderPos1],
        ]; // swaps positions of each value corresponding with the SortBar componenets being swapped

        this.setStateSortBarValues();
        clearInterval(intervalId);
      } else {
        element1.setAttribute("transform", `translate(${pos})`);
        element2.setAttribute("transform", `translate(${-pos})`);
        pos++; // swaps graphic positions of SortBar elements
      }
    }, this.state.animationSpeed);
  }

  // returns elements for BubbleSort object to main.tsx
  // viewBox creates a coordinate system for svg objects: viewBox="minX minY width height"

  render(): React.ReactElement {
    return (
      <>
        <Link to="/">Home</Link>
        <div>
          <p>Bubble Sort</p>
        </div>
        <br />
        <div>
          <svg
            width="1000"
            height="500"
            viewBox={`0 -100 ${this.veiwBoxWidth} 100`}
          >
            {this.state.sortBars}
          </svg>
        </div>
        <div className="input-container">
          <div>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>): void =>
                this.handleSubmit(event)
              }
            >
              <fieldset disabled={this.state.isSorting}>
                <legend>Values</legend>
                <input
                  type="text"
                  value={this.state.values}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => this.setValues(event.target.value)}
                />
                <input type="submit" value="Submit" />
              </fieldset>
            </form>
            <form
              onSubmit={(
                event: React.FormEvent<HTMLFormElement>
              ): Promise<void> => this.handleSort(event)}
            >
              <fieldset disabled={this.state.isSorting}>
                <input type="submit" value="Sort" />
              </fieldset>
            </form>
          </div>
          <div>
            <p>{`Speed: ${(20 - this.state.animationSpeed) / 10}x`}</p>
            <input
              type="range"
              min="5"
              max="15"
              step="1"
              value={this.state.animationSpeed}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                this.setAnimationSpeed(parseInt(event.target.value))
              }
            />
          </div>
        </div>
      </>
    );
  }
}

export default BubbleSort;
