import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  name?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class RouteErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in [${this.props.name || 'Unknown Route'}]:`, error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: '2rem',
            margin: '2rem auto',
            maxWidth: 640,
            border: '1px solid #fa5252',
            borderRadius: 8,
            backgroundColor: '#fff5f5',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Oops! This section crashed.</h2>
          <p>
            We&apos;ve logged the issue and are looking into it
            {this.props.name ? ` (${this.props.name})` : ''}.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: 4,
              backgroundColor: '#fa5252',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
