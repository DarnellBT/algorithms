import * as React from "react";
import * as ReactDOM from "react-dom";
// components
import ErrorBoundary from "@components/ErrorBoundary";
// styles
import "@styles/index.css";
// lazy loading App so that the screen displays "Loading..." while each page is being generated
const App = React.lazy(() => import("./App"));

// renders elements onto DOM
ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary fallback="Sorry. There was an error...">
      <React.Suspense fallback="Loading...">
        <App />
      </React.Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
