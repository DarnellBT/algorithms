import * as React from "react";

type ErrorBoundaryPropType = {
  fallback: string;
};

type ErrorBoundaryStateType = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryPropType,
  ErrorBoundaryStateType
> {
  constructor(props: ErrorBoundaryPropType) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): ErrorBoundaryStateType {
    return {
      hasError: true,
    };
  }

  render(): React.ReactElement {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }

    return <>{this.props.children}</>;
  }
}

export default ErrorBoundary;
