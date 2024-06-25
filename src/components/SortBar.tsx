import * as React from "react";
// utilities
import { COLOUR } from "../utils/colour";
// styles
import "../styles/SortBar.css";

type SortBarPropsType = {
  id: string;
  xPosition: number;
  height: number;
  value: number;
};

type SortBarStateType = {
  colour: string;
};

class SortBar extends React.Component<SortBarPropsType, SortBarStateType> {
  constructor(props: SortBarPropsType) {
    super(props);
    this.state = {
      colour: COLOUR.BLUE,
    };
  }

  render(): React.ReactElement {
    return (
      <g id={this.props.id} className="sort-bar" transform="">
        <title>{this.props.value}</title>
        <rect
          id={this.props.id + "-rect"}
          fill={this.state.colour}
          x={this.props.xPosition}
          y={-this.props.height}
          width="15"
          height={this.props.height}
        />
        <text
          x={this.props.xPosition + 7.5}
          y="-15"
          textAnchor="middle"
          fontSize=".25em"
        >
          {this.props.value}
        </text>
      </g>
    );
  }
}

export default SortBar;
