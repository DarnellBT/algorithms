import * as React from "react";
// components
import Widget from "../components/Widget";
// styles
import "@styles/Home.css";
import "@styles/Widget.css";

// structure of WidgetContentType objects for content contained in each Widget element
type WidgetContentType = {
  label: string;
  href: string;
};

class Home extends React.Component {
  private readonly labels: string[] = [
    "Bubble Sort",
    "Binary Search",
    "Linear Search",
    "Dijkstra",
  ];
  private readonly hrefs: string[] = [
    "/bubble-sort",
    "/binary-search",
    "/linear-search",
    "/dijkstra",
  ];

  private readonly widgetContent: WidgetContentType[] = this.labels.map(
    (label: string, index: number): WidgetContentType => {
      return {
        label: label,
        href: this.hrefs[index], // temporary buffer is concatonated
      };
    }
  );

  // returns elements for App object to main.tsx
  render(): React.ReactElement {
    return (
      <main>
        <h1>Algorithms</h1>
        <div className="container">
          {
            // creates each widget with corresponding content
            this.widgetContent.map(
              (
                { label, href }: WidgetContentType,
                index: number
              ): React.ReactElement<Widget> => (
                <Widget key={index.toString()} text={label} href={href} />
              )
            )
          }
        </div>
      </main>
    );
  }
}

export default Home;
