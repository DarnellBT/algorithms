import * as React from "react";
// utilities
import { COLOUR } from "../utils/colour";
// styles
import "../styles/SearchBlock.css";

type SearchBlockPropsType = {
  id: string;
  xPosition: number;
  value: number;
};

type SearchBlockStateType = {
  colour: string;
};

class SearchBlock extends React.Component<
  SearchBlockPropsType,
  SearchBlockStateType
> {
  constructor(props: SearchBlockPropsType) {
    super(props);
    this.state = {
      colour: COLOUR.BLUE,
    };
  }

  render(): React.ReactElement {
    return (
      <g id={this.props.id} className="search-block" transform="">
        <title>{this.props.value}</title>
        <rect
          id={this.props.id + "-rect"}
          fill={this.state.colour}
          x={this.props.xPosition}
          y="0"
          width="15"
          height="10"
        />
        <text
          x={this.props.xPosition + 7.5}
          y="5"
          textAnchor="middle"
          fontSize=".25em"
        >
          {this.props.value}
        </text>
      </g>
    );
  }
}

export default SearchBlock;
