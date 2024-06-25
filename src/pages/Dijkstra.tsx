import * as React from "react";
import { Link } from "react-router-dom";
// utilities
import { COLOUR } from "@utils/colour";
import { resetFill } from "@utils/resetFill";
// components
import SearchNode from "@components/SearchNode";
import Edge from "@components/Edge";

type DijkstraPropType = {};

type DijkstraStateType = {
  values: string;
  searchNodes: React.ReactElement<SearchNode>[];
  edges: React.ReactElement<Edge>[];
  animationSpeed: number;
  searchValue: number;
  foundText: string;
};

type DijkstraNode = {
  value: number;
  x: number;
  y: number;
  neighbours: number[]; // neihbours are labeled by their value in nodeValues
};

class Dijkstra extends React.Component<DijkstraPropType, DijkstraStateType> {
  private nodeValues: DijkstraNode[] = [
    { value: 0, x: 10, y: 80, neighbours: [1] },
    { value: 1, x: 30, y: 50, neighbours: [2] },
    { value: 2, x: 25, y: 70, neighbours: [3] },
    { value: 3, x: 75, y: 50, neighbours: [4] },
    { value: 4, x: 80, y: 75, neighbours: [5] },
    { value: 5, x: 50, y: 40, neighbours: [] },
  ];
  private veiwBoxWidth: number = 200;

  constructor(props: DijkstraPropType) {
    super(props); //no props are passed to componenet
    this.state = {
      values: this.nodeValues.toString(),
      searchNodes: this.setSearchNodeValues(),
      edges: this.setEdges(),
      animationSpeed: 1000,
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

  setFoundText(inputFoundText: string): void {
    this.setState({
      foundText: inputFoundText,
    });
  }

  setStateSearchNodeValues(): void {
    this.setState({
      searchNodes: this.setSearchNodeValues(),
    });
  }

  setSearchNodeValues(): React.ReactElement<SearchNode>[] {
    const nodes: React.ReactElement<SearchNode>[] = this.nodeValues.map(
      (node: DijkstraNode, index: number): React.ReactElement<SearchNode> => {
        return (
          <SearchNode
            key={index.toString()}
            id={`SearchNode-${index}`}
            xPosition={node.x}
            yPosition={node.y}
            value={node.value}
          />
        );
      }
    );

    return nodes;
  }

  setEdges(): React.ReactElement<Edge>[] {
    const edges: React.ReactElement<Edge>[] = this.nodeValues
      .map((node: DijkstraNode, index: number): React.ReactElement<Edge>[] => {
        const neighbourEdges: React.ReactElement<Edge>[] = [];

        for (let i: number = 0; i < node.neighbours.length; i++) {
          const searchNodeCircle1: HTMLElement | null = document.getElementById(
            `SearchNode-${index}-circle`
          );
          const searchNodeCircle2: HTMLElement | null = document.getElementById(
            `SearchNode-${node.neighbours[i]}-circle`
          );

          if (searchNodeCircle1 === null || searchNodeCircle2 === null) {
            continue;
          }

          const cx1: string | null = searchNodeCircle1.getAttribute("cx");
          const cy1: string | null = searchNodeCircle1.getAttribute("cy");
          const cx2: string | null = searchNodeCircle2.getAttribute("cx");
          const cy2: string | null = searchNodeCircle2.getAttribute("cy");

          if (cx1 === null || cy1 === null || cx2 === null || cy2 === null) {
            continue;
          }

          const y1: number = parseInt(cy1);
          const x2: number = parseInt(cx2);
          const x1: number = parseInt(cx1);
          const y2: number = parseInt(cy2);

          neighbourEdges.push(
            <Edge
              key={this.nodeValues.length.toString()}
              id={`Edge-${this.nodeValues.length}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              directed={false}
              value={1}
            />
          );
        }

        return neighbourEdges;
      })
      .flat();

    return edges;
  }

  handleOnClick(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    this.nodeValues.push({
      value: this.nodeValues.length,
      x: event.clientX,
      y: event.clientY,
      neighbours: [],
    });
    this.setStateSearchNodeValues();
  }

  handleSearch(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault(); // prevents the page from reloading on submit
    this.setFoundText("");
    this.setStateSearchNodeValues();
    resetFill(
      "SearchNode",
      this.nodeValues.map((node: DijkstraNode): number => node.value),
      "circle"
    );
    this.animate();
  }

  animate(): void {
    let searchNodeCircle: HTMLElement | null;
    let position: number = 0;
    const timeoutPeriod: number = this.state.animationSpeed * 0.5;
    const delay = (): Promise<number> =>
      new Promise<number>((handler: TimerHandler): number =>
        setTimeout(handler, timeoutPeriod)
      );
    let intervalId: number = setInterval(async (): Promise<void> => {
      resetFill(
        "SearchNode",
        this.nodeValues.map((node: DijkstraNode): number => node.value),
        "circle"
      );

      searchNodeCircle = document.getElementById(`SearchNode-${position}-rect`);

      if (searchNodeCircle !== null) {
        searchNodeCircle.setAttribute("fill", COLOUR.GREEN);

        await delay();

        if (this.state.searchValue == this.nodeValues[position].value) {
          searchNodeCircle.setAttribute("fill", COLOUR.YELLOW);
          this.setFoundText(`Found ${this.state.searchValue}`);
          clearInterval(intervalId);
        }

        if (position == this.nodeValues.length - 1) {
          searchNodeCircle.setAttribute("fill", COLOUR.RED);
          this.setFoundText(`Did not find ${this.state.searchValue}`);
          clearInterval(intervalId);
        }
      }

      position++;
    }, this.state.animationSpeed);
  }

  // returns elements for Dijkstra object to main.tsx
  render(): React.ReactElement {
    return (
      <>
        <Link to="/">Home</Link>
        <div>
          <p>Linear Search</p>
        </div>
        <svg
          width="1000"
          height="500"
          viewBox={`0 0 ${this.veiwBoxWidth} 100`}
          onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
            this.handleOnClick(event)
          }
        >
          {this.state.searchNodes}
          {this.state.edges}
        </svg>
        <div>
          <h2>{this.state.foundText}</h2>
        </div>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
            this.handleSearch(event);
          }}
        >
          <input
            type="number"
            value={this.state.searchValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
              this.setSearchValues(parseFloat(event.target.value))
            }
          />
          <input type="submit" value="Search" />
        </form>
      </>
    );
  }
}

export default Dijkstra;
