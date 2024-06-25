import * as React from "react";
import { Link } from "react-router-dom";
// utilities
import { COLOUR } from "@utils/colour";
import { resetFill } from "@utils/resetFill";
import { splitValues } from "@utils/splitValues";
// components
import SearchBlock from "@components/SearchBlock";

type LinearSearchPropType = {};

type LinearSearchStateType = {
  values: string;
  searchBlocks: React.ReactElement<SearchBlock>[];
  animationSpeed: number;
  isSearching: boolean;
  searchValue: number;
  foundText: string;
};

class LinearSearch extends React.Component<
  LinearSearchPropType,
  LinearSearchStateType
> {
  private blockValues: number[] = [7, 8, 9, 10, 11, 12];
  private veiwBoxWidth: number = this.blockValues.length * 25;

  constructor(props: LinearSearchPropType) {
    super(props); //no props are passed to componenet
    this.state = {
      values: this.blockValues.toString(),
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

    this.blockValues = splitNumberValues;
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
    this.animate();
  }

  animate(): void {
    const delay = (): Promise<number> =>
      new Promise<number>((handler: TimerHandler): void => {
        const timeoutPeriod: number = this.state.animationSpeed * 0.5;

        setTimeout(handler, timeoutPeriod);
      });
    let searchBlockRect: HTMLElement | null;
    let position: number = 0;
    let intervalId: number = setInterval(async (): Promise<void> => {
      resetFill("SearchBlock", this.blockValues, "rect");

      searchBlockRect = document.getElementById(`SearchBlock-${position}-rect`);

      if (searchBlockRect !== null) {
        searchBlockRect.setAttribute("fill", COLOUR.GREEN);

        await delay();

        if (this.state.searchValue == this.blockValues[position]) {
          searchBlockRect.setAttribute("fill", COLOUR.YELLOW);
          this.setFoundText(`Found ${this.state.searchValue}`);
          this.setIsSearching(false); // at the end of the search isSearching is assined to false
          clearInterval(intervalId);
        } else if (position == this.blockValues.length - 1) {
          searchBlockRect.setAttribute("fill", COLOUR.RED);
          this.setFoundText(`Did not find ${this.state.searchValue}`);
          this.setIsSearching(false); // at the end of the search isSearching is assined to false
          clearInterval(intervalId);
        }
      }

      position++;
    }, this.state.animationSpeed);
  }

  // returns elements for LinearSearch object to main.tsx
  render(): React.ReactElement {
    return (
      <>
        <Link to="/">Home</Link>
        <div>
          <p>Linear Search</p>
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
              onSubmit={(event: React.FormEvent<HTMLFormElement>): void =>
                this.handleSubmit(event)
              }
            >
              <fieldset disabled={this.state.isSearching}>
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

export default LinearSearch;
