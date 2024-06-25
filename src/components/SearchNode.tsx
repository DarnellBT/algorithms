import * as React from "react";
// utilities
import { COLOUR } from "@utils/colour";
// styles
import "@styles/SearchNode.css";

type SearchNodePropsType = {
  id: string;
  xPosition: number;
  yPosition: number;
  value: number;
};

type SearchNodeStateType = {
  colour: string;
};

class SearchNode extends React.Component<
  SearchNodePropsType,
  SearchNodeStateType
> {
  constructor(props: SearchNodePropsType) {
    super(props);
    this.state = {
      colour: COLOUR.BLUE,
    };
  }

  render(): React.ReactElement {
    return (
      <g id={this.props.id} className="search-node" transform="">
        <title>{this.props.value}</title>
        <circle
          id={this.props.id + "-circle"}
          fill={this.state.colour}
          cx={this.props.xPosition}
          cy={this.props.yPosition}
          r="5"
        />
        <text
          x={this.props.xPosition}
          y={this.props.yPosition + 1}
          textAnchor="middle"
          fontSize=".25em"
        >
          {this.props.value}
        </text>
      </g>
    );
  }
}

export default SearchNode;
