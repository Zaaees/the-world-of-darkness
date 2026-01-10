import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-900/50 text-white rounded-lg border border-red-700 m-4">
                    <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                    <p className="mb-2">We're sorry, but the application encountered an error.</p>
                    {this.state.error && (
                        <pre className="text-sm bg-black/50 p-2 rounded overflow-auto max-h-40">
                            {this.state.error.toString()}
                        </pre>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded transition"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
