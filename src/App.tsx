import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// pages
import Home from "@pages/Home";
import BubbleSort from "@pages/BubbleSort";
import BinarySearch from "@pages/BinarySearch";
import LinearSearch from "@pages/LinearSearch";
import Dijkstra from "@pages/Dijkstra";

class App extends React.Component {
  // returns elements for App object in main.tsx
  render(): React.ReactElement {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bubble-sort" element={<BubbleSort />} />
          <Route path="/binary-search" element={<BinarySearch />} />
          <Route path="/linear-search" element={<LinearSearch />} />
          <Route path="/dijkstra" element={<Dijkstra />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
