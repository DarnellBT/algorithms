import * as React from "react";
// utilities
import { COLOUR } from "@utils/colour";
// styles
import "@styles/Edge.css";

type EdgePropsType = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  directed: boolean;
  value: number;
};

type EdgeStateType = {
  colour: string;
};

class Edge extends React.Component<EdgePropsType, EdgeStateType> {
  constructor(props: EdgePropsType) {
    super(props);
    this.state = {
      colour: COLOUR.BLUE,
    };
  }

  render(): React.ReactElement {
    let reversedArrow: React.ReactElement<SVGPathElement> = <></>;

    if (!this.props.directed) {
      reversedArrow = (
        <path
          id={this.props.id + "-path"}
          marker-end={`url(#${this.props.id}-head)`}
          strokeWidth="1"
          fill="none"
          stroke="black"
          d={`M ${this.props.x2} ${this.props.y2} ${this.props.x1} ${this.props.y1}`}
        />
      );
    }

    return (
      <g id={this.props.id} className="search-node" transform="">
        <title>{this.props.value}</title>
        <defs>
          <marker
            id={this.props.id + "-head"}
            orient="auto"
            markerWidth="3"
            markerHeight="5"
            refX="5"
            refY="2"
          >
            <path d="M 0 0 V 4 L 2 2 Z" fill="black" />
          </marker>
        </defs>

        <path
          id={this.props.id + "-path"}
          markerEnd={`url(#${this.props.id}-head)`}
          strokeWidth="1"
          fill="none"
          stroke="black"
          d={`M ${this.props.x1} ${this.props.y1} ${this.props.x2} ${this.props.y2}`}
        />

        {reversedArrow}

        <text
          x={(this.props.x1 + this.props.x2) * 0.5}
          y={(this.props.y1 + this.props.y2) * 0.5}
          textAnchor="middle"
          fontSize=".4em"
          fill="#888"
        >
          {this.props.value}
        </text>
      </g>
    );
  }
}

export default Edge;
