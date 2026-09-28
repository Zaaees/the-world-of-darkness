// site-content: migrated
import { displayText } from '../core/content/store';
import SiteText from '../core/content/SiteText';
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
                    <h2 className="text-xl font-bold mb-2"><SiteText contentKey="common.text.00001" /></h2>
                    <p className="mb-2"><SiteText contentKey="common.text.00002" /></p>
                    {this.state.error && (
                        <pre className="text-sm bg-black/50 p-2 rounded overflow-auto max-h-40">
                            {displayText("common", this.state.error.toString())}
                        </pre>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded transition"
                    ><SiteText contentKey="common.text.00003" /></button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
