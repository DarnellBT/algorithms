import * as React from "react";
import { Link } from "react-router-dom";
// styles
import "../styles/Widget.css";

type WidgetPropsType = {
  href: string;
  text: string;
};

class Widget extends React.Component<WidgetPropsType> {
  constructor(props: WidgetPropsType) {
    super(props);
  }

  render(): React.ReactElement {
    return (
      <Link className="widget-link" to={this.props.href}>
        <div className="widget">
          <p>{this.props.text}</p>
        </div>
      </Link>
    );
  }
}

export default Widget;
