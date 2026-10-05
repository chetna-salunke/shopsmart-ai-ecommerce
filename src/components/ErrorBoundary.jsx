import { Component } from "react";

// Prevents a blank screen: shows a message instead if any component crashes.
export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="state" style={{ minHeight: "60vh" }}>
        <h1>Something went wrong</h1>
        <p>{String(this.state.error.message || this.state.error)}</p>
        <button className="btn" onClick={() => window.location.reload()}>Reload page</button>
      </div>
    );
  }
}
