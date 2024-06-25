import * as React from "react";
import { Link } from "react-router-dom";
// utilities
import { COLOUR } from "@utils/colour";
import { resetFill } from "@utils/resetFill";
import { splitValues } from "@utils/splitValues";
// components
import SearchBlock from "@components/SearchBlock";

type BinarySearchPropType = {};

type BinarySearchStateType = {
  values: string;
  searchBlocks: React.ReactElement<SearchBlock>[];
  animationSpeed: number;
  isSearching: boolean;
  searchValue: number;
  foundText: string;
};

type BinarySearchAnimationType = {
  lower: number;
  higher: number;
};

class BinarySearch extends React.Component<
  BinarySearchPropType,
  BinarySearchStateType
> {
  private blockValues: number[] = [7, 8, 9, 10, 11, 12]; // must be sorted
  private veiwBoxWidth: number = this.blockValues.length * 25;

  constructor(props: BinarySearchPropType) {
    super(props); //no props are passed to componenet
    this.state = {
      values: this.blockValues
        .sort((value1: number, value2: number): number => value1 - value2)
        .toString(),
      searchBlocks: this.setSearchBlockValues(),
      animationSpeed: 1000,
      isSearching: false,
      searchValue: 9,
      foundText: "",
    };
  }

  setValues(inputValues: string): void {
    this.setState({
      values: inputValues,
    });
  }

  setSearchValues(inputSearchValues: number): void {
    this.setState({
      searchValue: inputSearchValues,
    });
  }

  setAnimationSpeed(inputAnimationSpeed: number): void {
    this.setState({
      animationSpeed: inputAnimationSpeed,
    });
  }

  setIsSearching(inputIsSearching: boolean): void {
    this.setState({
      isSearching: inputIsSearching,
    });
  }

  setFoundText(inputFoundText: string): void {
    this.setState({
      foundText: inputFoundText,
    });
  }

  setStateSearchBlockValues(): void {
    this.setState({
      searchBlocks: this.setSearchBlockValues(),
    });
  }

  setSearchBlockValues(): React.ReactElement<SearchBlock>[] {
    const blocks: React.ReactElement<SearchBlock>[] = this.blockValues.map(
      (value: number, index: number): React.ReactElement<SearchBlock> => {
        return (
          <SearchBlock
            key={index.toString()}
            id={`SearchBlock-${index}`}
            xPosition={index * 20}
            value={value}
          />
        );
      }
    );

    return blocks;
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault(); // prevents the page from reloading on submit
    this.setFoundText("");

    const splitNumberValues: number[] = splitValues(this.state.values); // converts user submitted text into an array of numbers

    if (splitNumberValues == this.blockValues) {
      return; // prevents unnecessary rerender
    }
    if (splitNumberValues.includes(NaN)) {
      return;
    }
    if (splitNumberValues.some((value: number): boolean => value <= 0)) {
      return;
    }

    this.blockValues = splitNumberValues.sort(
      (value1: number, value2: number): number => value1 - value2
    );
    this.veiwBoxWidth = this.blockValues.length * 25;
    this.setStateSearchBlockValues();
    resetFill("SearchBlock", this.blockValues, "rect");
  }

  handleSearch(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault(); // prevents the page from reloading on submit
    this.setFoundText("");
    this.setStateSearchBlockValues();
    resetFill("SearchBlock", this.blockValues, "rect");
    this.setIsSearching(true);

    let lower: number = 0; // sets the initial state of the SearchBlocks at the start of the search
    let higher: number = this.blockValues.length - 1;
    let middle: number = Math.ceil(higher / 2);
    let lowerSearchBlockRect: HTMLElement | null = document.getElementById(
      `SearchBlock-${lower}-rect`
    );
    let higherSearchBlockRect: HTMLElement | null = document.getElementById(
      `SearchBlock-${higher}-rect`
    );
    let middleSearchBlockRect: HTMLElement | null = document.getElementById(
      `SearchBlock-${middle}-rect`
    );

    if (lowerSearchBlockRect !== null) {
      lowerSearchBlockRect.setAttribute("fill", COLOUR.RED);
    }

    if (higherSearchBlockRect !== null) {
      higherSearchBlockRect.setAttribute("fill", COLOUR.RED);
    }

    if (middleSearchBlockRect !== null) {
      if (this.state.searchValue == this.blockValues[middle]) {
        middleSearchBlockRect.setAttribute("fill", COLOUR.GREEN);
      } else {
        middleSearchBlockRect.setAttribute("fill", COLOUR.GREEN);
      }
    }

    this.animate({
      lower: lower,
      higher: higher,
    });
  }

  animate(animation: BinarySearchAnimationType): void {
    let lowerSearchBlockRect: HTMLElement | null;
    let higherSearchBlockRect: HTMLElement | null;
    let middleSearchBlockRect: HTMLElement | null;
    let discardedSearchBlockRect: HTMLElement | null;
    let lower: number = animation.lower;
    let higher: number = animation.higher;
    let middle: number = Math.ceil((lower + higher) / 2);
    let intervalId: number = setInterval((): void => {
      resetFill("SearchBlock", this.blockValues, "rect");

      if (this.state.searchValue < this.blockValues[middle]) {
        higher = middle - 1;
      } else if (this.state.searchValue > this.blockValues[middle]) {
        lower = middle + 1;
      } else {
        this.setFoundText(`Found ${this.state.searchValue}`);
        this.setIsSearching(false); // at the end of the search isSearching is assined to false
        clearInterval(intervalId);
      }

      if (higher < lower) {
        this.setFoundText(`Did not find ${this.state.searchValue}`);
        this.setIsSearching(false); // at the end of the search isSearching is assined to false
        clearInterval(intervalId);
      }

      middle = Math.ceil((lower + higher) / 2);
      lowerSearchBlockRect = document.getElementById(
        `SearchBlock-${lower}-rect`
      );
      higherSearchBlockRect = document.getElementById(
        `SearchBlock-${higher}-rect`
      );
      middleSearchBlockRect = document.getElementById(
        `SearchBlock-${middle}-rect`
      );

      if (lowerSearchBlockRect !== null) {
        lowerSearchBlockRect.setAttribute("fill", COLOUR.RED);
      }

      if (higherSearchBlockRect !== null) {
        higherSearchBlockRect.setAttribute("fill", COLOUR.RED);
      }

      if (middleSearchBlockRect !== null) {
        if (this.state.searchValue == this.blockValues[middle]) {
          middleSearchBlockRect.setAttribute("fill", COLOUR.YELLOW);
        } else {
          middleSearchBlockRect.setAttribute("fill", COLOUR.GREEN);
        }
      }

      for (let i = 0; i < this.blockValues.length; i++) {
        discardedSearchBlockRect = document.getElementById(
          `SearchBlock-${i}-rect`
        );

        if (discardedSearchBlockRect === null) {
          continue;
        }

        if (i < lower || i > higher) {
          discardedSearchBlockRect.setAttribute("opacity", "0.5");
        }
      }
    }, this.state.animationSpeed);
  }

  // render Binary Search page
  render(): React.ReactElement {
    return (
      <>
        <Link to="/">Home</Link>
        <div>
          <p>Binary Search</p>
        </div>
        <svg width="1000" height="500" viewBox={`0 0 ${this.veiwBoxWidth} 100`}>
          {this.state.searchBlocks}
        </svg>
        <div className="output-text-container">
          <h2>{this.state.foundText}</h2>
        </div>
        <div className="input-container">
          <div>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
                this.handleSubmit(event);
              }}
            >
              <fieldset disabled={this.state.isSearching}>
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
              onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
                this.handleSubmit(event);
                this.handleSearch(event);
              }}
            >
              <fieldset disabled={this.state.isSearching}>
                <legend>Search</legend>
                <input
                  type="number"
                  value={this.state.searchValue}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void =>
                    this.setSearchValues(parseFloat(event.target.value))
                  }
                />
                <input type="submit" value="Search" />
              </fieldset>
            </form>
          </div>
          <div>
            <p>{`Speed: ${(2000 - this.state.animationSpeed) / 1000}x`}</p>
            <input
              type="range"
              min="500"
              max="1500"
              step="100"
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

export default BinarySearch;
